# Contribution Guidelines
We'd love to receive your contribution to make this app grows. We appreciate your help. We invite you to read guidlines before contributing.



## Found a bug?
You can create issues to report a bug. Choose the bug template and provide all the requested information, 
you can always feel free to report the bug issue to my personal email: ehsun.ez@gmail.com.

## Have a Feature Request?
All feature requests should start with submitting an issue documenting the user story and acceptance criteria. Choose the feature request template and provide all the requested information, otherwise your issue could be closed. Again, feel free to submit a Pull Request with a proposed implementation of the feature.

# Ready to contribute
## Create an issue
Before submitting a new issue, please search the issues to make sure there isn't a similar issue doesn't already exist. Assuming no existing issues exist, please ensure you include the following bits of information when submitting the issue to ensure we can quickly reproduce your issue:

Version used
Platform (Linux, macOS, Windows)
The complete command that was executed
Any output from the command
The logs and dumps of execution for bugs report
Details of the expected results and how they differed from the actual results
Choose the appropriate issue template
Inform the related specifications that documents and details the expected behavior.
We may have additional questions and will communicate through the GitHub issue, so please respond back to our questions to help reproduce and resolve the issue as quickly as possible.

## How to submit Pull Requests
Fork this repo
Clone your fork and create a new branch: $ git checkout https://github.com/your_username_here/repo_name -b name_for_new_branch.
Make changes and test
Publish the changes to your fork
Submit a Pull Request with comprehensive description of changes
Pull Request must target master branch
For a Pull Request to be merged:
CI workflow must succeed
A project member must review and approve it
The reviewer may have additional questions and will communicate through conversations in the GitHub PR, so please respond back to our questions or changes requested during review.

## Styleguide
When submitting code, please make every effort to follow existing conventions and style in order to keep the code as readable as possible. Here are a few points to keep in mind:

Please run go fmt ./... before committing to ensure code aligns with go standards.
All dependencies must be defined in the go.mod file.
For details on the approved style, check out Effective Go.
Create tests for all new features.
The tests must be covered in CI workflow.
#License
By contributing your code, you agree to license your contribution under the terms of the Apache License 2.0. All files are released with the Apache License 2.0.
