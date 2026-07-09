#include <iostream>
#include <vector>
#include <conio.h>
#include <windows.h>

using namespace std;

class Cuenta {
private:
	string titular;
	double cantidad;
public:
	Cuenta(string titular, int cantidad = 100) : titular(titular), cantidad(cantidad) { }
	~Cuenta() {	}
	void setTitular(string titular) {
		this->titular = titular;
	}
	void setCantidad(double cantidad) {
		this->cantidad = cantidad;
	}
	string getTitular() {
		return this->titular;
	}
	double getCantidad() {
		return this->cantidad;
	}
	void ingresar(double cantidad) {
		if (cantidad >= 0) {
			this->cantidad += cantidad;
		}
	}
	double retirar(double cantidad) {
		if (cantidad > this->cantidad) {
			cantidad = this->cantidad;
			this->cantidad = 0;
		}
		else {
			this->cantidad -= cantidad;
		}
		return cantidad;
	}
	void mostrarInfo() {
		cout << "Titular: " << titular << "\nSaldo: " << cantidad << endl;
	}
};

int main() {
	// Declaración de variables
	string nombre;
	double cantidad;
	int opcion;
	int indice = 0;
	vector<Cuenta> cuentas;

	// Pedimos los datos al usuario
	cout << "Ingrese su nombre: ";
	cin >> nombre;
	cout << "Ingrese la cantidad a depositar: ";
	cin >> cantidad;

	// Crear la cuenta
	cuentas.push_back(Cuenta(nombre, cantidad));
	system("cls");

	// Interacción con el usuario
	while(true){
		cout << "Ingrese la operacion que desee realizar:\n";
		cout << "1. Seleccione el numero de cuenta\n";
		cout << "2. Depositar\n";
		cout << "3. Retirar\n";
		cout << "4. Crear una nueva cuenta\n";
		cout << "5. Mostrar informacion de la cuenta\n";
		cout << "6. Salir\n";
		opcion = _getch() - '0';

		// Condicional para manejar el flujo de entrada
		switch (opcion)
		{
		case 1:
			cout << "Ingrese el numero de cuenta (1 a " << cuentas.size() << " ): ";
			cin >> opcion;
			if (opcion > 0 && opcion <= cuentas.size()) {
				cout << "Indice seleccionado\n";
				indice = opcion - 1;
				cout << "Cuenta seleccionada: " << cuentas[indice].getTitular() << endl;
			}
			else {
				cout << "Indice fuera de rango\n";
			}
			break;
		case 2:
			cout << "Ingrese la cantidad a depositar: ";
			cin >> cantidad;
			cuentas[indice].ingresar(cantidad);
			break;
		case 3:
			cout << "Ingrese la cantidad a retirar: ";
			cin >> cantidad;
			cuentas[indice].retirar(cantidad);
			break;
		case 4:
			cout << "Ingrese el nombre de la cuenta: ";
			cin >> nombre;
			cout << "Ingrese el saldo inicial: ";
			cin >> cantidad;
			cuentas.push_back(Cuenta(nombre, cantidad));
			break;
		case 5:
			cuentas[indice].mostrarInfo();
			break;
		case 6: 
			cout << "Saliendo del programa...";
			Sleep(500);
			system("cls");
			return 0;
		default:
			cout << "Opcion invalida, intente nuevamente\n";
			break;
		}
		system("pause");
		system("cls");
	}
}
