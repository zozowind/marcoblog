#!/usr/bin/env python3
import os
import re
import sys


def parse_env_example(file_path):
    """
    Parses the .env.example file and returns a dictionary with variable names as keys and default values as values.
    """
    env_vars = {}
    with open(file_path, "r") as f:
        for line_number, line in enumerate(f, 1):
            line = line.strip()
            # Ignore empty lines and comments
            if not line or line.startswith("#"):
                continue
            # Use regex to parse KEY=VALUE
            match = re.match(r"^([^=]+)=(.*)$", line)
            if match:
                key = match.group(1).strip()
                value = match.group(2).strip()
                # Remove possible quotes around the value
                if (value.startswith('"') and value.endswith('"')) or (
                    value.startswith("'") and value.endswith("'")
                ):
                    value = value[1:-1]
                env_vars[key] = value

                # If the value is a variable
                # if the variable is defined in env_vars, take the real value
                # if the variable is not defined in env_vars, set it to empty string
                if re.match(r"^\$\{([^}]+)\}$", value):
                    if value in env_vars:
                        env_vars[key] = env_vars[value]
                    else:
                        env_vars[key] = ""
            else:
                print(f"Warning: Unable to parse line {line_number}: {line}")
    return env_vars

def add_quotes_if_needed(value):
    """
    Adds quotes around the value if it contains special characters or is an asterisk.
    """
    if value == "":
        return "''"
    if re.search(r"[:\s]", value) or value == "*":
        return f"'{value}'"
    return value


def generate_shared_env_block(env_vars, anchor_name="shared-api-worker-env"):
    """
    Generates a shared environment variables block as a YAML string.
    """
    lines = [f"x-shared-env: &{anchor_name}"]
    for key, default in env_vars.items():
        if key == "COMPOSE_PROFILES":
            continue
        value = add_quotes_if_needed(default)
        lines.append(f"  {key}: {value}")
    return "\n".join(lines)


def replace_env_vars(template_content, env_vars):
    """
    Replaces the variables in the template content with the values in the env_vars dictionary.
    """
    for key, default in env_vars.items():
            # Replace ${VAR:-default} pattern
            def replace_match(match, default=default):
                inline_default = match.group(1) if match.group(1) else ""
                result = default
                if result == "" and inline_default != "":
                    result = inline_default
                result = add_quotes_if_needed(result)
                return result

            # Handle both ${VAR:-default} and ${VAR} patterns
            template_content = re.sub(
                rf"\${{{key}(?:\:-([^}}]*))?}}",
                replace_match,
                template_content,
                flags=re.MULTILINE,
            )
    return template_content


def replace_variable_default(match):
    """
    Replaces the variables not defined in the env_vars dictionary in the template content with it's default value
    """
    default = match.group(1)
    return add_quotes_if_needed(default)

def insert_shared_env(template_path, output_path, shared_env_block, env_vars, header_comments):
    """
    Inserts the shared environment variables block and header comments into the template file,
    removing any existing x-shared-env anchors, and generates the final docker-compose.yaml file.
    """
    with open(template_path, "r") as f:
        template_content = f.read()

    # Remove existing x-shared-env: &shared-api-worker-env lines
    template_content = re.sub(
        r"^x-shared-env: &shared-api-worker-env\s*\n?",
        "",
        template_content,
        flags=re.MULTILINE,
    )

    # Replace the env vars in the template content
    template_content = replace_env_vars(template_content, env_vars)
 
    # Replace the variables not defined in the env_vars dictionary in the template content with it's default value
    template_content = re.sub(
        rf"\${{[^:]+:-([^}}]*)}}",
        replace_variable_default,
        template_content,
        flags=re.MULTILINE,
    )

    # Prepare the final content with header comments and shared env block
    final_content = f"{header_comments}\n{shared_env_block}\n\n{template_content}"

    with open(output_path, "w") as f:
        f.write(final_content)
    print(f"Generated {output_path}")


def main():
    env_example_path = ".env.example"
    template_path = "docker-compose-template.yaml"
    output_path = "docker-compose.yaml"
    anchor_name = "shared-api-worker-env"  # Can be modified as needed

    # Define header comments to be added at the top of docker-compose.yaml
    header_comments = (
        "# ==================================================================\n"
        "# WARNING: This file is auto-generated by generate_docker_compose\n"
        "# Do not modify this file directly. Instead, update the .env.example\n"
        "# or docker-compose-template.yaml and regenerate this file.\n"
        "# ==================================================================\n"
    )

    # Check if required files exist
    for path in [env_example_path, template_path]:
        if not os.path.isfile(path):
            print(f"Error: File {path} does not exist.")
            sys.exit(1)

    # Parse .env.example file
    env_vars = parse_env_example(env_example_path)

    if not env_vars:
        print("Warning: No environment variables found in .env.example.")


    # Generate shared environment variables block
    shared_env_block = generate_shared_env_block(env_vars, anchor_name)

    # Insert shared environment variables block and header comments into the template
    insert_shared_env(template_path, output_path, shared_env_block, env_vars, header_comments)


if __name__ == "__main__":
    main()
