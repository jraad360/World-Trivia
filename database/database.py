from fileinput import filename
import json
import os

COUNTRIES_FILE = 'database/database.json'

def read_json_from_file(file_name):
  file = open(file_name)
  dict = json.load(file)
  file.close()

  return dict

class DatabaseManager:
  def __init__(self):
    self.countries = read_json_from_file(os.path.realpath('.') + '/' + COUNTRIES_FILE)['countries']
    self.next_id = len(self.countries)

  def get_country(self, id):
    if str(id) in self.countries.keys():
      country = self.countries[str(id)]
      country['id'] = str(id)
      return country
    else:
      return None
            
  def create_country(self, country):
    self.countries[str(self.next_id)] = country
    country['id'] = str(self.next_id)
    self.next_id += 1
    return country

  def update_country(self, id, country):
    if str(id) in self.countries.keys():
      self.countries[str(id)] = country
      country['id'] = str(id)
      return country
    else:
      return None

  def delete_country(self, id):
    if str(id) in self.countries.keys():
      country = self.countries[str(id)]
      country['id'] = str(id)
      del country
      return country
    else:
      return None

  def get_countries(self, query=''):
    if query == None or query == '':
      return self.countries
    else:
      query = query.lower()
      return dict(filter(lambda item: self.country_does_match(item, query), self.countries.items()))
  
  def country_does_match(self, country, query):
    return query in country[1]['name'].lower() \
      or query in country[1]['continent'].lower() \
      or query in query in country[1]['officialName'].lower() \
      or query in query in country[1]['capital'].lower()
    
  def save_image(self, image):
    image_path = '/static/images/' + image.filename
    content = image.read()
    try:
      with open(os.path.realpath('.') + image_path, 'wb') as file:
        file.write(content)
    except Exception as e:
      print(e)
    file.close()
    return image_path
