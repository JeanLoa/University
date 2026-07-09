#include <iostream>

using namespace std;

int main() {
	float radio;
	float hipo;
	float alturat;
	const int pi = 3.1416;
	float areatriangulo;
	float areacirculo;

	cout << "Ingrese el valor del radio:\n";
	cin >> radio;
	cout << "Ingrese el valor de la hipotenusa\n";
	cin >> hipo;

	alturat = sqrt(pow(hipo, 2) - pow(radio, 2));
	areatriangulo = radio * alturat;
	areacirculo = pi * radio;
	float areafigura = areatriangulo + areacirculo;

	cout << "El area de la figura es: " << areafigura;

	return 0;
}
