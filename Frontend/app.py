from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load the trained model
model = joblib.load('model.joblib')

# Define a route for predictions
@app.route('/predict', methods=['POST'])
def predict():
    # Parse the incoming data
    data = request.get_json()
    
    # Extract the input features
    waste_type = data['waste_type']
    crop_residual = float(data['crop_residual'])
    manure_volume = float(data['manure_volume'])
    ph_level = float(data['ph_level'])
    retention = float(data['retention'])

    # Process waste_type into numerical form (example)
    if waste_type == "Livestock Manure":
        waste_type_val = 1
    else:
        waste_type_val = 0

    # Prepare data for prediction (ensure the input order matches your model)
    input_data = np.array([[waste_type_val, crop_residual, manure_volume, ph_level, retention]])
    
    # Make the prediction
    biogas_production = model.predict(input_data)[0]

    # Return the result as JSON
    return jsonify({'biogas_production': biogas_production})

if __name__ == '__main__':
    app.run(debug=True)
