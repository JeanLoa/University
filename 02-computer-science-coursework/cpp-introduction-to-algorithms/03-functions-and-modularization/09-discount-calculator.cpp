#include <iostream>

using namespace std;

int main() {
	int Monto;
	cout << "Ingrese el monto: ";
	cin >> Monto;
	(Monto <= 0) ? (cout << "El monto ingresado no ha sido reconocido", exit(0)) : (void)0;

	float Descuento = (Monto < 10000) ? 0.80 : 0.90;
	Monto *= Descuento;

	cout << "El monto con el descuento es: " << Monto;

	return 0;
}
