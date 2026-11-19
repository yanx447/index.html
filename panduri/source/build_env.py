"""`npm run build`: runs build.py with a Python that has the build's dependencies (requirements.txt: Pillow).

* This Python already has Pillow (a Mac or PC set up as the README says): build.py runs with it, nothing changes.
* It has not (a fresh machine, Vercel's build image): .venv-build/ is made here once, requirements.txt is
  installed into it, and build.py runs with that Python. The system Python is never changed.

`python3 build.py` still works by itself wherever Pillow is installed."""
import os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
VENV = os.path.join(HERE, '.venv-build')
VENV_PY = os.path.join(VENV, 'Scripts', 'python.exe') if os.name == 'nt' else os.path.join(VENV, 'bin', 'python')


def has_deps(py):
    return os.path.exists(py) and subprocess.run([py, '-c', 'import PIL'], capture_output=True).returncode == 0


def main():
    py = sys.executable
    if not has_deps(py):
        py = VENV_PY
        if not has_deps(py):
            print('build: Pillow is not installed here; installing requirements.txt into .venv-build/', flush=True)
            try:
                if not os.path.exists(py):
                    subprocess.run([sys.executable, '-m', 'venv', VENV], check=True)
                subprocess.run([py, '-m', 'pip', 'install', '--disable-pip-version-check', '--no-input',
                                '-r', os.path.join(HERE, 'requirements.txt')], check=True)
            except (OSError, subprocess.CalledProcessError) as e:
                sys.exit(f'build: could not install the Python dependencies ({e}). '
                         f'Install them by hand: python3 -m pip install -r panduri/source/requirements.txt')
            if not has_deps(py):
                sys.exit('build: Pillow is still not importable from .venv-build/')
    print('build: Python', subprocess.run([py, '-c', 'import sys, PIL; print(sys.version.split()[0], "· Pillow", PIL.__version__)'],
                                          capture_output=True, text=True).stdout.strip(), flush=True)
    return subprocess.run([py, 'build.py'] + sys.argv[1:], cwd=HERE).returncode


if __name__ == '__main__':
    sys.exit(main())
