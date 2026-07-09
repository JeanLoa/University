#include <iostream>

using namespace std;

int main() {
	int tiempoens;
	int horas, minutos, segundos;
	cout << "Ingrese el tiempo en segundos: ";
	cin >> tiempoens;
	horas = tiempoens / 3600;
	minutos = tiempoens % 3600 / 60;
	segundos = tiempoens % 60;
	cout << "\nEl tiempo en horas es: " << horas;
	cout << "\nEl tiempo en minutos es: " << minutos;
	cout << "\nEl tiempo en segundos es: " << segundos;

	return 0;
}
