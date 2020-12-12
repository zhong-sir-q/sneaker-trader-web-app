import os

entries = os.listdir()

def copy_and_write_file_content(file_name_one, file_name_two):
  """
  copy contents from file_name_one and write to file_name_two
  """
  with open(file_name_one) as f1:
    to_copy = [l for l in f1.readlines()]
    with open(file_name_two, 'w') as f2:
      f2.writelines(to_copy)

# see more about the folder structure in https://terragrunt.gruntwork.io/docs/getting-started/quick-start/

common_environments = ['cloudfront', 'ecs', 'cognito', 'mysql']
common_files = ['main.tf', 'terragrunt.hcl']

dir_tree = { 'prod': {
  'environments': common_environments,
  'files': common_files
}, 'dev': {
  'environments': common_environments,
  'files': common_files
} }

# create the directories if not exists
for stage in dir_tree:
  try:
    os.mkdir(stage)
  except FileExistsError:
    pass

  root_stage_terragrunt = '{}/{}'.format(stage, 'terragrunt.hcl')

  copy_and_write_file_content('template_root_terragrunt.txt', root_stage_terragrunt)    

  for env in dir_tree[stage]['environments']:
    try:
      os.mkdir('{0}/{1}'.format(stage, env))
    except FileExistsError:
      pass
    for file_name in dir_tree[stage]['files']:
      path_name = '{0}/{1}/{2}'.format(stage, env, file_name)

      with open(path_name, 'w'):
        if file_name == 'terragrunt.hcl':
          copy_and_write_file_content('template_module_terragrunt.txt', path_name)
