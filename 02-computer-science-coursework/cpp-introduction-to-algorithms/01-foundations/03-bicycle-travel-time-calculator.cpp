#include <iostream>

using namespace std;

int main() {
	float velocidad;
	float distancia;
	float tiempo;

	cout << "Ingrese la velocidad de la bicicleta en metros por minuto: ";
	cin >> velocidad;
	cout << "Ingrese la distancia en metros entre 2 ciudades: ";
	cin >> distancia;
	tiempo = distancia / velocidad;
	cout << "El tiempo que tardara en ir de ciudad en ciudad es: " << tiempo << " minutos";

	return 0;
}
