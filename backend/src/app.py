from flask import Flask, request, jsonify
from flask_pymongo import PyMongo, ObjectId
from flask_cors import CORS

app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb://localhost:27017/zoo'
mongo = PyMongo(app)

db = mongo.db.Animales

CORS(app)
@app.route('/animals', methods=['POST'])
def createAnimal():
    id = db.insert_one({
        'nombre': request.json['nombre'],
        'edad': request.json['edad'],
        'grupo_animal': request.json['grupo_animal'],
        'color': request.json['color'],
        'fecha_registro': request.json['fecha_registro'],
    })
    
    return 'Animal created', 201

@app.route('/animals', methods=['GET'])
def getAnimals():
    animals = list(db.find())
    for animal in animals:
        animal['_id'] = str(animal['_id'])  
    return jsonify(animals)

@app.route('/animals/view/<id>', methods=['GET'])
def getAnimal(id):
    animal = db.find_one({'_id': ObjectId(id)})
    if animal:
        animal['_id'] = str(animal['_id'])
        return jsonify(animal), 200
    else:
        return jsonify({"error": "Animal not found"}), 404

@app.route('/animals/<id>', methods=['PUT'])
def updateAnimal(id):
    update = db.update_one(
        {'_id': ObjectId(id)},
        {'$set': {
            'nombre': request.json.get('nombre', ''),
            'edad': request.json.get('edad', ''),
            'grupo_animal': request.json.get('grupo_animal', ''),
            'color': request.json.get('color', ''),
            'fecha_registro': request.json.get('fecha_registro', ''),
        }}
    )
    if update.matched_count:
        return jsonify({"msg": "Animal updated"}), 200
    else:
        return jsonify({"error": "Animal not found"}), 404

@app.route('/animals/<id>', methods=['DELETE'])
def deleteAnimal(id):
    result = db.delete_one({'_id': ObjectId(id)})
    if result.deleted_count:
        return jsonify({"msg": "Animal deleted"}), 200
    else:
        return jsonify({"error": "Animal not found"}), 404



if __name__ == "__main__":
    app.run(debug=True)
