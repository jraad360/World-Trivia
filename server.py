from itertools import count
from pydoc import cli
from flask import Flask, redirect, render_template
from flask import Response, request, jsonify
from database.database import DatabaseManager

app = Flask(__name__)
db = DatabaseManager()
popular_country_ids = [0, 1, 2]

@app.route("/")
def home():
  global popular_countries
  popular_countries = []

  for id in popular_country_ids:
    popular_countries.append(db.get_country(id=id))

  data = {
    'countries': popular_countries,
  }
  return render_template('home.html', data=data)

@app.route('/countries', methods=['GET', 'POST'])
def countries():
  if request.method == 'GET':
    search = request.args['search'].strip() if 'search' in request.args else ''
    return get_countries(search)
  elif request.method == 'POST':
    country = request.get_json()['country']
    return post_countries(country)

@app.route('/countries/create')
def createCountryPage():
  data = {}
  return render_template('edit-country.html', data=data)

@app.route('/countries/<id>/edit')
def editCountryPage(id):
  country = db.get_country(id=id)
  if country != None:
    data = {
      'country': country
    }
    return render_template('edit-country.html', data=data)
  else:
    # TODO: error handling
    return {'error': 'country not found'}

@app.route('/countries/<id>', methods=['GET', 'DELETE', 'PUT'])
def country(id):
  if request.method == 'GET':
    return get_country(id)
  elif request.method == 'PUT':
    country = request.get_json()['country']
    return put_country(id, country)
  elif request.method == 'DELETE':
    return delete_country(id)

def get_country(id):
  country = db.get_country(id=id)
  if country != None:
    data = {
      'country': country
    }
    return render_template('country.html', data=data)
  else:
    # TODO: error handling
    return {'error': 'country not found'}

def put_country(id, country):
  country = db.update_country(id=id, country=country)
  if country != None:
    data = {
      'country': country
    }
    return data
  else:
    # TODO: error handling
    return {'error': 'country not found'}

def delete_country(id):
  country = db.delete_country(id=id)
  if country != None:
    data = {
      'country': country
    }
    return redirect('/')
  else:
    # TODO: error handling
    return {'error': 'country not found'}

def get_countries(search):
  data = {
    'search': search,
    'countries': db.get_countries(query=search.lower())
  }
  return render_template('countries.html', data=data)

def post_countries(country):
  country = db.create_country(country)
  data = {
    'country': country
  }
  return data

@app.route('/countries/<id>/image', methods=['POST'])
def image(id):
  country = db.get_country(id=id)
  filename = db.save_image(request.files['file'])
  country['flag'] = filename

  return {'status': 201}

if __name__ == '__main__':
   app.run(debug=True, port=3000)
