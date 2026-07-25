"""
Patches ios/Podfile (regenerated fresh by `expo prebuild --clean` every
build) to compile the bundled `fmt` C++ library against the C++17
standard instead of C++20.

Why: Xcode 26.4's Clang tightened consteval validation, and the fmt
version vendored by React Native 0.81.x fails to compile under those
stricter rules. Since consteval doesn't exist pre-C++20, scoping just
the fmt pod to C++17 sidesteps the broken check without touching the
rest of the project (which genuinely needs C++20).

Remove this once React Native ships a fmt version that's fixed upstream
— see facebook/react-native#55601 and expo/expo#44229.
"""

import re

PODFILE = "ios/Podfile"
PATCH_LINES = """    installer.pods_project.targets.each do |target|
      if target.name == 'fmt'
        target.build_configurations.each do |config|
          config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++17'
        end
      end
    end
"""

with open(PODFILE) as f:
    content = f.read()

if "target.name == 'fmt'" in content:
    print("fmt patch already present — skipping")
else:
    # Match the post_install block opener regardless of exact surrounding
    # content — this is far more stable across Expo/Podfile template
    # versions than matching one specific line inside the block.
    match = re.search(r"(post_install do \|installer\|\s*\n)", content)
    if match:
        insert_at = match.end()
        content = content[:insert_at] + PATCH_LINES + content[insert_at:]
        with open(PODFILE, "w") as f:
            f.write(content)
        print("Patched Podfile: fmt pod pinned to C++17 (Xcode 26 consteval workaround)")
    else:
        print("WARNING: could not find 'post_install do |installer|' block — dumping Podfile for diagnosis:")
        print("=" * 60)
        print(content)
        print("=" * 60)

