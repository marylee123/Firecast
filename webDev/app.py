from flask import Flask, render_template, request, jsonify
import json
import pandas as pd

app = Flask(__name__)

# Load the API key from config.json
with open('config.json') as f:
    config = json.load(f)
api_key = config['API_KEY']

# Route for the main page
@app.route('/')
def index():
    return render_template('index.html', api_key=api_key)

# API endpoint to get predictions for a given date
@app.route('/get_prediction', methods=['GET'])
def get_prediction():
    month = int(request.args.get('month'))
    day = int(request.args.get('day'))
    # Read the CSV file
    df = pd.read_csv('data/prediction.csv')
    # Filter data for the selected date
    df_filtered = df[(df['month'] == month) & (df['day'] == day)]
    # Prepare data to return
    data = df_filtered[['latitude', 'longitude', 'prediction']].to_dict(orient='records')
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
