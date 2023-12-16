# Build sample content site
# Tests integration between Hugo and the Next.js build

set -e

SOURCEDIR=$(readlink -f "..")
BUILDDIR=.build

echo 'Cleaning build dir'
rm -rf $BUILDDIR
mkdir $BUILDDIR
cd $BUILDDIR

echo 'Getting Markdown content'
rsync -a $SOURCEDIR/endgameviable-content/* .

echo 'Getting theme'
mkdir -p themes/endgameviable-json-theme
rsync -a --exclude-from=$SOURCEDIR/spiritriot-generator/json-theme/.gitignore $SOURCEDIR/spiritriot-generator/json-theme/* themes/endgameviable-json-theme

echo 'Running hugo build'
hugo

cd -
rm -rf data_local
rsync -a $BUILDDIR/public/* data_local

rm -rf $BUILDDIR
