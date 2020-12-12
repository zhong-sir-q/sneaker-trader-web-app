include {
  # search up the dir tree to the root terragrunt.hcl and inherit the remote_state configuration from it
  path = find_in_parent_folders()
}
