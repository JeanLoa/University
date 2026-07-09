#include <iostream>

using namespace std;

int main() {
	int num;
	int digito1, digito2, digito3;
	cout << "Ingresa un numero: ";
	cin >> num;
	digito1 = num / 100;
	digito2 = num % 100 / 10;
	digito3 = num % 10;

	string resultado = (num > 999 || num < 100) ? "Numero Incorrecto" : (digito1 == digito3) ? "Es numero capicua" : "No es numero capicua";

	cout << resultado;

	return 0;
}
