from flask import Flask, request, jsonify
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
# Route to serve predictions
@app.route('/get_prediction', methods=['GET'])
def get_prediction():
    try:
        # Get query parameters
        month = int(request.args.get('month'))
        day = int(request.args.get('day'))

        # Load the CSV
        df = pd.read_csv('data/prediction.csv')

        # Filter by month and day
        df_filtered = df[(df['month'] == month) & (df['day'] == day)]

        # Prepare the data
        data = df_filtered[['latitude', 'longitude', 'prediction']].to_dict(orient='records')
        return jsonify(data)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
