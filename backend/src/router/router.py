# routes.py
from flask import request, jsonify
from flask_pymongo import ObjectId
from app import db  

def createAnimal():
    id = db.insert_one({
        'nombre': request.json['nombre'],
        'edad': request.json['edad'],
        'grupo_animal': request.json['grupo_animal'],
        'color': request.json['color'],
        'fecha_registro': request.json['fecha_registro'],
    })
    return 'Animal created', 201

def getAnimals():
    animals = list(db.find())
    for animal in animals:
        animal['_id'] = str(animal['_id'])
    return jsonify(animals)

def getAnimal(id):
    animal = db.find_one({'_id': ObjectId(id)})
    if animal:
        animal['_id'] = str(animal['_id'])
        return jsonify(animal), 200
    else:
        return jsonify({"error": "Animal not found"}), 404

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

def deleteAnimal(id):
    result = db.delete_one({'_id': ObjectId(id)})
    if result.deleted_count:
        return jsonify({"msg": "Animal deleted"}), 200
    else:
        return jsonify({"error": "Animal not found"}), 404
