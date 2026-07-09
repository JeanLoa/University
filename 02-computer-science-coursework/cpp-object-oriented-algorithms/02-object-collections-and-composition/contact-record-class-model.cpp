#include <iostream>
#include <string>
#include <conio.h>
#include <Windows.h>

using namespace std;

class CONTACTO {
private:
	string nombre;
	string telefono;
	char sexo;
	string facultad;
	string nacimiento;
	string email;
	string redsocial;

public:

	/*
	Metodos
	*/

	// Set
	void setNombre(string nombre) {
		this->nombre = nombre;
	}
	void setTelefono(string telefono){ 
		int tel = stoi(telefono.substr(0, 9));
		if (tel > 900000000 && tel < 1000000000) {
			this->telefono = telefono;
		}
	}
	void setSexo(char sexo) {
		sexo = toupper(sexo);
		if (sexo == 'V' || sexo == 'F') {
			this->sexo = sexo;
		}
	}
	void setFacultad(string facultad) {
		this->facultad = facultad;
	}
	void setNacimiento(string nacimiento) {
		int dia, mes, año;
		char slash[2];
		bool valido = false;
		dia = stoi(nacimiento.substr(0, 2));
		mes = stoi(nacimiento.substr(3, 2));
		año = stoi(nacimiento.substr(6, 2));
		if (dia >= 1 && dia <= 30) {
			valido = true;
		}
		if (mes >= 1 && mes <= 12) {
			valido = true;
		}
		if (año >= 1 && año <= 99) {
			valido = true;
		}
		if (valido) {
			this->nacimiento = nacimiento;
		}
	}
	void setEmail(string email) {
		this->email = email;
	}
	void setRedsocial(string redsocial) {
		for (char& c : redsocial) {
			c == toupper(c);
		}
		if (redsocial == "GOOGLE+" || redsocial == "FACEBOOK" || redsocial == "TWITTER" || redsocial == "WHATSAPP") {
			this->redsocial == redsocial;
		}
	}

	// Get

	string getNombre() {
		return this->nombre;
	}
	string getTelefono() {
		return this->telefono;
	}
	char getSexo() {
		return this->sexo;
	}
	string getFacultad() {
		return this->facultad;
	}
	string getNacimiento() {
		return this->nacimiento;
	}
	string getEmail() {
		return this->email;
	}
	string getRedsocial() {
		return this->redsocial;
	}

	// Delete
	void deleteNombre() {
		this->nombre = "";
		cout << "\nEliminado satisfactoriamente";
	}
	void deleteTelefono() {
		this->telefono = "";
		cout << "\nEliminado satisfactoriamente";
	}
	void deleteSexo() {
		this->sexo = ' ';
		cout << "\nEliminado satisfactoriamente";
	}
	void deleteFacultad() {
		this->facultad = "";
		cout << "\nEliminado satisfactoriamente";
	}
	void deleteNacimiento() {
		this->nacimiento = "";
		cout << "\nEliminado satisfactoriamente";
	}
	void deleteEmail() {
		this->email = "";
		cout << "\nEliminado satisfactoriamente";
	}
	void deleteRedsocial() {
		this->redsocial = "";
		cout << "\nEliminado satisfactoriamente";
	}

	void mostrarDetalles(int i) {
		cout << "\nContacto " << i + 1 << ":";
		cout << "\nNombre: " << this->nombre;
		cout << "\nTelefono: " << this->telefono;
		cout << "\nSexo: " << this->sexo;
		cout << "\nFacultad: " << this->facultad;
		cout << "\nNacimiento: " << this->nacimiento;
	}
};


/*
Función Principal
*/

int main() {
	string dato;
	char sexo;
	int n;

	// Variables de apoyo
	int indice = 1;
	int opcion;
	int mes;

	bool Salir = false;
	do {
		cout << "\nIngrese la cantidad de contactos: ";
		cin >> n;
		system("cls");
	} while (n <= 0);

	CONTACTO* Contactos = new CONTACTO[n];

	while (true) {
		cout << "\nInteractuando con el contacto " << indice;
		cout << "\n1. Seleccionar por indice";
		cout << "\n2. Asignar";
		cout << "\n3. Eliminar";
		cout << "\n4. Reporte de contactos que cumplen en Mayo";
		cout << "\n5. Reporte de contactos que son varones";
		cout << "\n6. Reporte de contactos que tienen red social Facebook y Whatsapp";
		cout << "\n7. Salir";
		opcion = _getch() - '0';
		switch (opcion) {
		case 1:
			cout << "\nIngrese el indice a interactuar: ";
			cin >> opcion;
			if (opcion >= 0 && opcion < n) {
				indice = opcion;
			}
			break;
		case 2:
			while (!Salir) {
				cout << "\n1. Asignar nombre";
				cout << "\n2. Asignar telefono";
				cout << "\n3. Asignar sexo";
				cout << "\n4. Asignar facultad";
				cout << "\n5. Asignar fecha de nacimiento";
				cout << "\n6. Asignar email";
				cout << "\n7. Salir";
				opcion = _getch() - '0';
				switch (opcion) {
				case 1:
					cout << "\nIngrese el nombre: ";
					cin >> dato;
					Contactos[indice - 1].setNombre(dato);
					break;
				case 2:
					cout << "\nIngrese el telefono: ";
					cin >> dato;
					Contactos[indice - 1].setTelefono(dato);
					break;
				case 3:
					cout << "\nIngrese el sexo (V - F): ";
					cin >> sexo;
					Contactos[indice - 1].setSexo(sexo);
					break;
				case 4:
					cout << "\nIngrese la facultad: ";
					cin >> dato;
					Contactos[indice - 1].setFacultad(dato);
					break;
				case 5:
					cout << "\nIngrese la fecha de nacimiento (dd/mm/aa): ";
					cin >> dato;
					Contactos[indice - 1].setNacimiento(dato);
					break;
				case 6:
					cout << "\nIngrese el email: ";
					cin >> dato;
					Contactos[indice - 1].setEmail(dato);
					break;
				case 7:
					Salir = true;
					Sleep(500);
					break;
				}
				Sleep(500);
				system("cls");
			}
			break;
		case 3:
			while (!Salir) {
				cout << "\n1. Eliminar nombre";
				cout << "\n2. Eliminar telefono";
				cout << "\n3. Eliminar sexo";
				cout << "\n4. Eliminar facultad";
				cout << "\n5. Eliminar fecha de nacimiento";
				cout << "\n6. Eliminar email";
				opcion = _getch() - '0';

				switch (opcion) {
				case 1:
					Contactos[indice - 1].deleteNombre();
					break;
				case 2:
					Contactos[indice - 1].deleteTelefono();
					break;
				case 3:
					Contactos[indice - 1].deleteSexo();
					break;
				case 4:
					Contactos[indice - 1].deleteFacultad();
					break;
				case 5:
					Contactos[indice - 1].deleteNacimiento();
					break;
				case 6:
					Contactos[indice - 1].deleteEmail();
					break;
				case 7:
					Salir = true;
					Sleep(500);
					break;
					Sleep(500);
					system("cls");
				}
			}
			break;
		case 4:
			for (int i = 0; i < n; ++i) {
				dato = Contactos[i].getNacimiento();
				mes = stoi(dato.substr(3, 2));
				if (mes == 2) {
					Contactos[i].mostrarDetalles(i);
				}
			}
			break;
		case 5:
			for (int i = 0; i < n; ++i) {
				if (Contactos[i].getSexo() == 'V') {
					Contactos[i].mostrarDetalles(i);
				}
			}
			break;
		case 6:
			for (int i = 0; i < n; ++i) {
				if (Contactos[i].getRedsocial() == "FACEBOOK" || Contactos[i].getRedsocial() == "WHATSAPP") {
					Contactos[i].mostrarDetalles(i);
				}
			}
			break;
		case 7:
			return 0;
		}
	}
}
