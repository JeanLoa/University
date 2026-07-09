#include <iostream>
#include <conio.h>
#include <vector>
#include <windows.h>

using namespace std;

class PLATO {
	// Parte privada de la Clase
private:
	string nombre;
	bool caliente;
	bool picante;
	int calorias;
	int precio;

	// Parte pública de la Clase
public:
	// Metodos set
	void setNombre(string nombre) {
		this->nombre = nombre;
	}
	void setCaliente(bool caliente) {
		this->caliente = caliente;
	}
	void setPicante(bool picante) {
		this->picante = picante;
	}
	void setCalorias(int calorias) {
		this->calorias = calorias;
	}
	void setPrecio(int precio) {
		this->precio = precio;
	}

	// Metodos get
	string getNombre() {
		return this->nombre;
	}
	void getCaliente() {
		if (this->caliente == true) {
			cout << "Caliente";
		}
		else {
			cout << "Frio";
		}
	}
	void getPicante() {
		if (this->picante == true) {
			cout << "Picante";
		}
		else {
			cout << "No picante";
		}
	}
	int getCalorias() {
		return this->calorias;
	}
	int getPrecio() {
		return this->precio;
	}

	// Eliminar
	void deleteNombre() {
		this->nombre = "";
		cout << "Eliminado satisfactoriamente";
	}
	void deleteCaliente() {
		this->caliente = 0;
		cout << "Eliminado satisfactoriamente";
	}
	void deletePicante() {
		this->picante = 0;
		cout << "Eliminado satisfactoriamente";
	}
	void deleteCalorias() {
		this->calorias = 0;
		cout << "Eliminado satisfactoriamente";
	}
	void deletePrecio() {
		this->precio = 0;
		cout << "Eliminado satisfactoriamente";
	}

	// Detalles
	void mostrarDetalles(int i) {
		cout << "\nPlato: " << i+1;
		cout << "\nNombre: " << this->nombre;
		cout << "\nCaliente: " << (this->caliente ? "Si" : "No");
		cout << "\nPicante: " << (this->picante ? "Si" : "No");
		cout << "\nCalorias: " << this->calorias;
		cout << "\nPrecio: " << this->precio << endl;
	}
};

int main() {
	// Declaración de variables
	int n;
	int indice = 1;
	int opcion;
	int caliente;
	int picante;
	int calorias;
	int precio;
	bool Salir;
	string nombre;

	// Validacion de la cantidad de platos
	do {
		cout << "Ingrese la cantidad de platos a almacenar: ";
		cin >> n;
		system("cls");
	} while (n <= 0);
	vector<PLATO> Platos;
	Platos.resize(n);

	// Interacción con el usuario
	while (true) {
		Salir = false;
		system("cls");
		cout << "\nInteractuando con el plato: " << indice;
		cout << "\n1. Seleccione Indice";
		cout << "\n2. Modificar";
		cout << "\n3. Obtener";
		cout << "\n4. Eliminar";
		cout << "\n5. Mostrar detalles";
		cout << "\n6. Reporte de platos caros mayores a S/100";
		cout << "\n7. Salir";
		opcion = _getch() - '0';
		switch (opcion) {
		case 1:
			cout << "\nIngrese el indice (1 a " << Platos.size() << "): ";
			cin >> opcion;
			if (opcion >= 1 && opcion <= Platos.size()) {
				indice = opcion;
			}
			break;
		case 2:
			// Interracion para modificar
			while (!Salir) {
				system("cls");
				cout << "\n1. Modificar nombre";
				cout << "\n2. Modificar calentura";
				cout << "\n3. Modificar picosidad";
				cout << "\n4. Modificar calorias";
				cout << "\n5. Modificar precio";
				cout << "\n6. Salir";
				opcion = _getch() - '0';
				switch (opcion) {
				case 1:
					cout << "\nIngrese el nombre: ";
					cin >> nombre;
					Platos[indice - 1].setNombre(nombre);
					break;
				case 2:
					cout << "\nIngrese calentura (1: Caliente - 2: Frio): ";
					cin >> caliente;
					if (caliente == 1) {
						Platos[indice - 1].setCaliente(true);
					}
					else if (caliente == 2) {
						Platos[indice - 1].setCaliente(false);
					}
					break;
				case 3:
					cout << "\nIngrese picosidad (1: Picante - 2: No picante): ";
					cin >> picante;
					if (picante == 1) {
						Platos[indice - 1].setPicante(true);
					}
					else if (picante == 2) {
						Platos[indice - 1].setPicante(false);
					}
					break;
				case 4:
					cout << "\nIngrese las calorias: ";
					cin >> calorias;
					Platos[indice - 1].setCalorias(calorias);
					break;
				case 5:
					cout << "\nIngrese el precio: ";
					cin >> precio;
					Platos[indice - 1].setPrecio(precio);
					break;
				case 6:
					Salir = true;
					break;
				default:
					cout << "\nOpcion invalida, vuelva a intentar";
					break;
				}
				Sleep(500);
			}
		case 3:
			// Interacción para obtener
			while (!Salir) {
				system("cls");
				cout << "\n1. Obtener nombre";
				cout << "\n2. Obtener calentura";
				cout << "\n3. Obtener picosidad";
				cout << "\n4. Obtener calorias";
				cout << "\n5. Obtener precio";
				cout << "\n6. Salir";
				opcion = _getch() - '0';
				switch (opcion) {
				case 1:
					Platos[indice - 1].getNombre();
					break;
				case 2:
					Platos[indice - 1].getCaliente();
					break;
				case 3:
					Platos[indice - 1].getPicante();
					break;
				case 4:
					Platos[indice - 1].getCalorias();
					break;
				case 5:
					Platos[indice - 1].getPrecio();
					break;
				case 6:
					Salir = true;
					break;
				default:
					cout << "\nOpcion invalida, vuelva a intentar";
					break;
				}
				Sleep(500);
			}
			break;
		case 4:
			// Interacción para eliminar
			while (!Salir) {
				system("cls");
				cout << "\n1. Eliminar nombre";
				cout << "\n2. Eliminar calentura";
				cout << "\n3. Eliminar picosidad";
				cout << "\n4. Eliminar calorias";
				cout << "\n5. Eliminar precio";
				cout << "\n6. Salir";
				opcion = _getch() - '0';
				switch (opcion) {
				case 1:
					Platos[indice - 1].deleteNombre();
					break;
				case 2:
					Platos[indice - 1].deleteCaliente();
					break;
				case 3:
					Platos[indice - 1].deletePicante();
					break;
				case 4:
					Platos[indice - 1].deleteCalorias();
					break;
				case 5:
					Platos[indice - 1].deletePrecio();
					break;
				default:
					cout << "\nOpcion invalida, vuelva a intentar";
					break;
				}
				Sleep(500);
				system("cls");
			}
			break;
			// Mostrar detalles
		case 5:
			Platos[indice - 1].mostrarDetalles(indice - 1);
			_getch();
			break;
			// Mostrar detalles de platos con un precio mayor a 100 soles
		case 6:
			system("cls");
			for (int i = 0; i < Platos.size(); ++i) {
				if (Platos[i].getPrecio() > 100) {
					Platos[i].mostrarDetalles(i);
				}
			}
			_getch();
			break;
		case 7:
			system("cls");
			cout << "\nSaliendo del programa...";
			return 0;
			break;
		default:
			break;
		}
	}
}
