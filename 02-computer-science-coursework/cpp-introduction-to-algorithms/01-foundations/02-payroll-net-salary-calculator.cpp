#include <iostream>

using namespace std;

int main() {
	int tf;
	int ht;
	float sba;
	float sbr;
	float sne;
	cout << "Ingrese la tarifa horaria: ";
	cin >> tf;
	cout << "Ingrese las horas trabajadas: ";
	cin >> ht;
	sba = tf * ht;
	sbr = sba + sba * 0.18;
	sne = sbr - sbr * 0.12;

	cout << "El sueldo basico es: " << sba;
	cout << "\nEl sueldo bruto es: " << sbr;
	cout << "\nEl sueldo neto es: " << sne;

	return 0;
}
