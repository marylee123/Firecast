import ee
import pandas as pd
from tqdm import tqdm  # Import tqdm for progress bars
import tensorflow as tf
from numba.cuda import jit
import torch 

print(tf.test.is_built_with_cuda())
if torch.cuda.is_available():
    print("CUDA is available. GPU will be used.")
    print("GPU device:", torch.cuda.get_device_name())
else:
    print("CUDA is not available. Running on CPU.")
service_account = 'firecast@western-trilogy-439400-a6.iam.gserviceaccount.com'
credentials = ee.ServiceAccountCredentials(service_account, 'sm-private-key.json')
ee.Initialize(credentials=credentials, project = 'western-trilogy-439400-a6')

# Output file for results
# TODO CHANGE ME!!!
output_file = 'EVI-2015.csv'
print("Num GPUs Available: ", len(tf.config.list_physical_devices('GPU')))
# MODIS Image Collection
# TODO CHANGE ME!!!
# MOD13Q1
collection = ee.ImageCollection('MODIS/MOD09GA_006_EVI')


# Adjusted Scale for sampling (increase to reduce number of points)
scale = 1000  # Increased scale to 1000m for fewer sample points (lower resolution)

# Define the Region of Interest (ROI)
roi = ee.Geometry.Rectangle(
    [-104.564, 33.164,
     -101.203 , 31.039]
)

# Create a grid of points covering the region

with torch.device("cuda:0"):
    #@jit(device=True)
    def create_grid(roi, spacing):
        lon_lat_image = ee.Image.pixelLonLat().reproject('EPSG:4326', None, spacing)
        lon_lat_points = lon_lat_image.sample(region=roi, scale=spacing, projection='EPSG:4326', geometries=True)
        return lon_lat_points

    # Grid spacing in meters (larger grid spacing for fewer points)
    spacing = 1000  # Increase the grid spacing to 1000m (adjust as necessary)

    # Generate grid points over the ROI
    grid_points = create_grid(roi, spacing)

    # Define a function to process images in smaller batches with progress bars
    # @jit(target_backend='cuda')
    def batch_process_images(images, grid_points, scale):
        results = []

        num_images = images.size().getInfo()

        for i in tqdm(range(0, num_images, 10), desc='Processing image batches'):
            batch = images.toList(10, i)  # Get a batch of 10 images
            batch_size = batch.size().getInfo()
            for j in tqdm(range(batch_size), desc='Processing images in batch', leave=False):
                image = ee.Image(batch.get(j))
                image_date = ee.Date(image.get('system:time_start')).format('YYYY-MM-dd')
                data_dict = image.sampleRegions(
                    collection=grid_points,
                    scale=scale,
                    geometries=True
                ).map(lambda f: f.set('date', image_date))

                # Process smaller chunks of points
                feature_list = data_dict.toList(250)  # Limit to 250 points at a time (prev: 500)
                num_features = feature_list.size().getInfo()

                for k in tqdm(range(0, num_features, 250), desc='Processing feature chunks', leave=False):
                    chunk = feature_list.slice(k, k + 250).getInfo()

                    # Iterate over the chunk directly, since chunk is already a list of features
                    for feature in chunk:
                        properties = feature['properties']
                        result = {
                            'date': properties['date'],
                            'longitude': feature['geometry']['coordinates'][0],
                            'latitude': feature['geometry']['coordinates'][1],
                            'EVI': properties.get('EVI', None)
                        }
                        results.append(result)

        return results

    # Years to consider (limit to a smaller range or specific months for faster processing)
    start_date = '2015-01-01'  # Starting date
    end_date = '2016-01-01'    # Ending date 2023-12-31

    # Filter MODIS collection for the specific smaller date range
    images = collection.filterDate(start_date, end_date)

    # Prepare to store the results
    results = []

    # Batch process the images in smaller groups with progress bars
    year_results = batch_process_images(images, grid_points, scale)
    results.extend(year_results)

    # Convert results to a DataFrame
    df = pd.DataFrame(results)

    # Print a preview of the DataFrame
    print(df.head())

    # Save the DataFrame to CSV locally
    df.to_csv(output_file, index=False)