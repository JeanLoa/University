#include <iostream>
#include <string>

using namespace std;

char PrimeraLetra(string Texto) {
	char Letra = Texto[0];
	return Letra;
}

int main() {
	string Texto;
	char Letra;
	cout << "Ingrese una cadena de texto: ";
	cin >> Texto;
	Letra = PrimeraLetra(Texto);
	cout << "La primera letra del texto es: " << Letra;

	return 0;
}
