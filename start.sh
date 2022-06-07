cd api || exit
echo "Starting API..."
npm start
cd ../ || exit
echo "Starting application..."
npm start