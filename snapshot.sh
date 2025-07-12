#!/bin/bash

OUTPUT_FILE="snapshot.txt"
rm -f "$OUTPUT_FILE"

# Arrays for arguments
INCLUDE_DIRS=()
EXTENSIONS=()

# Parse args: -d <dir> and -e <ext>
while [[ $# -gt 0 ]]; do
  case "$1" in
    -d)
      INCLUDE_DIRS+=("$2")
      shift 2
      ;;
    -e)
      EXTENSIONS+=("$2")
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Exclude rules (node_modules, .git, etc.)
EXCLUDE_PATHS=(
  -path './node_modules' -prune -o
  -path './dist' -prune -o
  -path './.git' -prune -o
  -name 'package-lock.json' -prune -o
  -name 'snapshot.sh' -prune -o
  -name '.env' -prune -o
  -name '*.txt' -prune -o
  -name 'README.md' -prune
)

# Ignore test files
TEST_FILE_EXCLUDES=( ! -name '*.test.*' ! -name '*.spec.*' )

# Build final list of target files
FILES=()

if [ "${#INCLUDE_DIRS[@]}" -eq 0 ]; then
  INCLUDE_DIRS=(".")  # Default to current dir
fi

for dir in "${INCLUDE_DIRS[@]}"; do
  if [ "${#EXTENSIONS[@]}" -gt 0 ]; then
    # Build -iname filters
    EXT_FILTER=()
    for ext in "${EXTENSIONS[@]}"; do
      EXT_FILTER+=( -iname "*${ext}" -o )
    done
    unset 'EXT_FILTER[-1]' # remove last -o

    while IFS= read -r file; do
      FILES+=("$file")
    done < <(find "$dir" \( "${EXCLUDE_PATHS[@]}" \) -o \( \( "${EXT_FILTER[@]}" \) -type f "${TEST_FILE_EXCLUDES[@]}" \) -print)
  else
    while IFS= read -r file; do
      FILES+=("$file")
    done < <(find "$dir" \( "${EXCLUDE_PATHS[@]}" \) -o \( -type f "${TEST_FILE_EXCLUDES[@]}" \) -print)
  fi
done

# Write to snapshot.txt
for file in "${FILES[@]}"; do
  echo "#### FILE_PATH: '$file'" >> "$OUTPUT_FILE"
  echo "#### CONTENT" >> "$OUTPUT_FILE"
  cat "$file" >> "$OUTPUT_FILE"
  echo -e "\n" >> "$OUTPUT_FILE"
done
