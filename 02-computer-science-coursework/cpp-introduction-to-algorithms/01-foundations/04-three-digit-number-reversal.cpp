#include <iostream>
#include <string>

using namespace std;

int main() {
	int num;
	int digito1, digito2, digito3;
	int numreves;
	int digitoreves1, digitoreves2, digitoreves3;
	cout << "Ingrese un numero de 3 cifras: ";
	cin >> num;
	digito1 = num / 100;
	digito2 = num % 100 / 10;
	digito3 = num % 10;
	digitoreves1 = digito3 * 100;
	digitoreves2 = digito2 * 10;
	digitoreves3 = digito1;
	numreves = digitoreves1 + digitoreves2 + digitoreves3;
	string verificacion = (num > 999 || num < 100) ? "Numero Incorrecto" : "El numero al reves es " + to_string(numreves);

	cout << verificacion;

	return 0;
}
