from itertools import count
from pydoc import cli
from flask import Flask, flash, redirect, render_template, Response, request, jsonify, Markup
from numpy import array
from database.database import DatabaseManager
import re
import os

app = Flask(__name__)
app.secret_key = os.urandom(12)
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
    country = dict(request.form)
    country['image'] = request.files['image']
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
  cities = [''] * 10
  new_country = {}

  for item in country.keys():
    result = re.search(r"city-(.*)", item)
    if result == None:
      new_country[item] = country[item]
      continue
    index = int(result.group(1))
    cities[index] = country[item]
    
  new_country['cities'] = cities
  image = new_country.pop('image', None)

  country = db.create_country(new_country)
  filename = db.save_image(image)
  country['flag'] = filename
  db.update_country(id, country)

  flash(Markup(f'<i class="fa fa-check"></i> New country successfully added. View it <a href="/countries/{country["id"]}">here</a>.'))
  return redirect('/countries/create')

@app.route('/countries/<id>/image', methods=['POST'])
def image(id):
  country = db.get_country(id=id)
  filename = db.save_image(request.files['image'])
  country['flag'] = filename
  db.update_country(id, country)

  return {'status': 201}

if __name__ == '__main__':
   app.run(debug=True, port=3000)
