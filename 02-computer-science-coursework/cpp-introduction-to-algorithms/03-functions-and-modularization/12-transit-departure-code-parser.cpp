#include <iostream>
#include <string>

using namespace std;

void Codigo() {
	string Codigo;
	char Departamento, Parada;
	int Salida;
	cout << "Ingrese el codigo de salida: ";
	cin >> Codigo;
	(Codigo.substr(0, 1) == "1" || Codigo.substr(0, 1) == "2" || Codigo.substr(0, 1) == "3") ? (void)0 : (cout << "El codigo no ha sido identificado", exit(0));
	(stoi(Codigo.substr(1, 2)) >= 24 || stoi(Codigo.substr(0, 1)) < 0) ? (cout << "El codigo no ha sido identificado", exit(0)) : (void)0;
	(Codigo.substr(0, 1) == "1" || Codigo.substr(0, 1) == "2") ? (void)0 : (cout << "El codigo no ha sido identificado", exit(0));

	Departamento = (Codigo.substr(0,1) == "1") ? 'T' : (Codigo.substr(0,1) == "2") ? 'A' : 'P';
	Salida = stoi(Codigo.substr(1, 2));
	Parada = (Codigo.substr(3,1) == "1") ? 'S' : 'N';
	cout << "\nDepartamento: " << Departamento;
	cout << "\nSalida: " << Salida;
	cout << "\nParada: " << Parada;
}

int main() {
	Codigo();

	return 0;
}
