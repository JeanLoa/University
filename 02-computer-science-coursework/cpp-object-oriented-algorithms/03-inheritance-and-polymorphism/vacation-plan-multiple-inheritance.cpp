#include "pch.h"
#include <iostream>
#include <string>
#include <iomanip>
#include <vector>
using namespace std;

class Boleto {
private:
	string codigo;
	string fecha_salida;
	string fecha_regreso;
public:
	Boleto(){}
	Boleto(string codigo, string fecha_salida, string fecha_regreso){
		for (char& c : codigo) {
			c = toupper(c);
		}
		this->codigo = codigo;
		for (char& c : fecha_salida) {
			c = toupper(c);
		}
		this->fecha_salida = fecha_salida;
		for (char& c : fecha_regreso) {
			c = toupper(c);
		}
		this->fecha_regreso = fecha_regreso;
	}
	~Boleto() {}

	string getCodigo() {
		return codigo;
	}
	string getSalida() {
		return fecha_salida;
	}
	string getRegreso() {
		return fecha_regreso;
	}
	void mostrarBoleto() {
		cout << "Codigo: " << setw(10) << codigo << ", Fecha de salida: " << setw(8) << fecha_salida << ", Fecha de regreso: " << setw(8) << fecha_regreso;
	}
};

class Hotel {
private:
	string nombre;
	string ubicacion;
public:
	Hotel(){}
	Hotel(string nombre, string ubicacion){
		for (char& c : nombre) {
			c = toupper(c);
		}
		this->nombre = nombre;
		for (char& c : ubicacion) {
			c = toupper(c);
		}
		this->ubicacion = ubicacion;
	}
	~Hotel(){}
	string getNombre() {
		return nombre;
	}
	string getUbicacion() {
		return ubicacion;
	}
	void mostrarHotel() {
		cout << "Hotel: " << nombre << ", Ubicacion: " << ubicacion;
	}
};

class PlanVacacion : public Hotel, public Boleto {
private:
	PlanVacacion** vacaciones;
	int n;
public:
	PlanVacacion(): n(0), vacaciones(nullptr){}
	PlanVacacion(string codigo, string fechaSalida, string fechaRegreso, string nombreHotel, string ubicacionHotel) :
		Boleto(codigo, fechaSalida, fechaRegreso), Hotel(nombreHotel, ubicacionHotel) {}
	~PlanVacacion() {}

	// Implementacion de la clase
	void agregarVacacion(PlanVacacion* nuevo) {
		PlanVacacion** copia = new PlanVacacion * [n + 1];
		for (int i = 0; i < n; ++i) {
			copia[i] = vacaciones[i];
		}
		copia[n] = nuevo;
		delete[] vacaciones;
		vacaciones = copia;
		++n;
	}
	void eliminarVacacion(int indice) {
		if (n > 0) {
			PlanVacacion** copia = new PlanVacacion * [n - 1];
			delete vacaciones[indice];
			for (int i = indice; i < n - 1; ++i) {
				vacaciones[i] = vacaciones[i + 1];
			}
			for (int i = 0; i < n - 1; ++i) {
				copia[i] = vacaciones[i];
			}
			delete[] vacaciones;
			vacaciones = copia;
			--n;
		}
		else {
			cout << "No hay vacaciones por eliminar";
		}
	}
	void insertarVacacion(PlanVacacion* nuevo, int indice) {
		if (indice >= 0 && indice < n) {
			PlanVacacion** copia = new PlanVacacion * [n + 1];
			for (int i = 0; i < indice; ++i) {
				copia[i] = vacaciones[i];
			}
			copia[indice] = nuevo;
			for (int i = indice; i < n; ++i) {
				copia[i + 1] = vacaciones[i];
			}
			delete[] vacaciones;
			vacaciones = copia;
			++n;
		}
	}

	// Pedidos del Ejercicio
	void mostrarVacacionesenIntervalo(string inicio_fecha, string fin_fecha) {
		if (n > 0) {
			int inicio_pdia, inicio_pmes, inicio_paño;
			int fin_pdia, fin_pmes, fin_paño;
			inicio_pdia = stoi(inicio_fecha.substr(0, 2));
			inicio_pmes = stoi(inicio_fecha.substr(3, 2));
			inicio_paño = stoi(inicio_fecha.substr(6, 4));
			fin_pdia = stoi(fin_fecha.substr(0, 2));
			fin_pmes = stoi(fin_fecha.substr(3, 2));
			fin_paño = stoi(fin_fecha.substr(6, 4));
			if (inicio_fecha.substr(2, 1) != "/" || fin_fecha.substr(5, 1) != "/") {
				cout << "La fecha ingresada no ha sido reconocida";
				return;
			}
			vector<int> indices;
			for (int i = 0; i < n; ++i) {
				int salida = stoi(vacaciones[i]->getSalida().substr(6, 4) + vacaciones[i]->getSalida().substr(3, 2) + vacaciones[i]->getSalida().substr(0, 2));
				int regreso = stoi(vacaciones[i]->getRegreso().substr(6, 4) + vacaciones[i]->getRegreso().substr(3, 2) + vacaciones[i]->getRegreso().substr(0, 2));

				int inicio = stoi(to_string(inicio_paño) + (inicio_pmes < 10 ? "0" : "") + to_string(inicio_pmes) + (inicio_pdia < 10 ? "0" : "") + to_string(inicio_pdia));
				int fin = stoi(to_string(fin_paño) + (fin_pmes < 10 ? "0" : "") + to_string(fin_pmes) + (fin_pdia < 10 ? "0" : "") + to_string(fin_pdia));

				if (salida >= inicio && regreso <= fin) {
					indices.push_back(i);
				}
			}
			if (!indices.empty()) {
				cout << "Las fechas de vacaciones disponibles:" << endl;
				for (int i : indices) {
					vacaciones[i]->mostrarBoleto();
					cout << endl;
					vacaciones[i]->mostrarHotel();
					cout << endl;
				}
			}
			else {
				cout << "No hay fechas registradas en el intervalo";
			}
		}
		else {
			cout << "No hay fechas registradas";
		}
	}
	void mostrarVacacionesMismoHotel(string hotelbuscado) {
		if (n > 0) {
			for (char& c : hotelbuscado) {
				c = toupper(c);
			}
			for (int i = 0; i < n; ++i) {
				if (vacaciones[i]->getNombre() == hotelbuscado) {
					vacaciones[i]->mostrarBoleto();
					cout << endl;
					vacaciones[i]->mostrarHotel();
					cout << endl;
				}
			}
		}
		else {
			cout << "No hay vacaciones registradas";
		}
	}
	void mostrarVacacionesDisponibles() {
		if (n > 0) {
			for (int i = 0; i < n; ++i) {
				vacaciones[i]->mostrarBoleto();
				cout << endl;
				vacaciones[i]->mostrarHotel();
				cout << endl;
			}
		}
		else {
			cout << "No hay vacaciones registradas";
		}
	}
	int getN() {
		return n;
	}
};

int main() {
	PlanVacacion* plan;
	PlanVacacion* Lista = new PlanVacacion;
	// Variables
	int opcion, indice;
	string nombre, ubicacion, codigo, fecha_salida, fecha_regreso;
	while (true) {
		system("cls");
		cout << "1. Agregar plan de vacacion";
		cout << "\n2. Insertar plan de vacacion";
		cout << "\n3. Eliminar plan de vacacion";
		cout << "\n4. Mostrar planes de vacacion";
		cout << "\n5. Mostrar planes de vacacion en intervalo";
		cout << "\n6. Mostrar planes de vacacion por hotel";
		cout << "\n7. Salir";
		cout << "\nElija una opcion: ";
		cin >> opcion;
		system("cls");
		switch (opcion) {
		case 1:
			do {
				cin.clear();
				cout << "Ingrese el nombre del hotel: ";
				cin >> nombre;
				cout << "Ingrese la ubicacion del hotel: ";
				cin >> ubicacion;
				cout << "Ingrese el codigo del boleto: ";
				cin >> codigo;
				cout << "Ingrese la fecha de salida (dd/mm/aaaa): ";
				cin >> fecha_salida;
				cout << "Ingrese la fecha de regreso: (dd/mm/aaaa): ";
				cin >> fecha_regreso;
			} while (cin.fail());
			plan = new PlanVacacion(codigo, fecha_salida, fecha_regreso, nombre, ubicacion);
			Lista->agregarVacacion(plan);
			break;
		case 2:
			do {
				cin.clear();
				cout << "Ingrese el indice a insertar (0 - " << Lista->getN() - 1 << "): ";
				cin >> indice;
				cout << "Ingrese el nombre del hotel: ";
				cin >> nombre;
				cout << "Ingrese la ubicacion del hotel: ";
				cin >> ubicacion;
				cout << "Ingrese el codigo del boleto: ";
				cin >> codigo;
				cout << "Ingrese la fecha de salida (dd/mm/aaaa): ";
				cin >> fecha_salida;
				cout << "Ingrese la fecha de regreso: (dd/mm/aaaa): ";
				cin >> fecha_regreso;
			} while (cin.fail());
			plan = new PlanVacacion(codigo, fecha_salida, fecha_regreso, nombre, ubicacion);
			Lista->insertarVacacion(plan, indice);
			break;
		case 3:
			do {
				cout << "Ingrese el indice a eliminar (0 - " << Lista->getN() - 1 << "): ";
				cin >> indice;
			} while (cin.fail());
			Lista->eliminarVacacion(indice);
			break;
		case 4:
			Lista->mostrarVacacionesDisponibles();
			break;
		case 5:
			do {
				cout << "Ingrese la fecha de salida (dd/mm/aaaa): ";
				cin >> fecha_salida;
				cout << "Ingrese la fecha de regreso (dd/mm/aaaa): ";
				cin >> fecha_regreso;
			} while (cin.fail());
			Lista->mostrarVacacionesenIntervalo(fecha_salida, fecha_regreso);
			break;
		case 6:
			do {
				cout << "Ingrese el nombre del hotel: ";
				cin >> nombre;
			} while (cin.fail());
			Lista->mostrarVacacionesMismoHotel(nombre);
			break;
		case 7:
			cout << "Saliendo...";
			return 0;
		default:
			cout << "Ingrese una opcion valida";
			break;
		}
		system("pause>0");
	}


	return 0;
}
