#include <iostream>
#include <conio.h>
#include <vector>
#include <Windows.h>
#include <string>

using namespace std;

// Declaración de la clase
class Eclipse {
	// Parte privada de la clase
private:
	string Tipo_de_Eclipse;
	string Fecha;
	int Hora;
	char Sismos;
	char Lluvias;
	string Visibilidad;

	// Parte publica de la clase
public:

	// Asignar
	void setTipo(string Tipo) {
		for (char &c : Tipo) {
			c = toupper(c);
		}
		if (Tipo == "SOLAR" || Tipo == "LUNAR") {
			Tipo_de_Eclipse = Tipo;
		}
	}
	void setFecha(string Fecha) {
		bool valido = false;
		int dia, mes, año;
		
		dia = stoi(Fecha.substr(0, 2));
		mes = stoi(Fecha.substr(3, 2));
		año = stoi(Fecha.substr(6, 2));
		
		if (dia >= 1 && dia <= 30){
			valido = true;
		}
		if (mes >= 1 && mes <= 12) {
			valido = true;
		}
		if (año >= 0 && año <= 99) {
			valido = true;
		}

		if (valido) {
			this->Fecha = Fecha;
		}
	}
	void setHora(int Hora) {
		if (Hora >= 0 && Hora <= 2359) {
			this->Hora = Hora;
		}
	}
	void setSismos(char Sismos) {
		Sismos = toupper(Sismos);
		if (Sismos == 'S' || Sismos == 'N') {
			this->Sismos = Sismos;
		}
	}
	void setLluvias(char Lluvias) {
		Lluvias = toupper(Lluvias);
		if (Lluvias == 'S' || Lluvias == 'N') {
			this->Lluvias = Lluvias;
		}
	}
	void setVisibilidad(string Visibilidad) {
		for (char& c : Visibilidad) {
			c = toupper(c);
		}
		if (Visibilidad == "AMERICA DEL SUR" || Visibilidad == "AMERICA DEL NORTE" || Visibilidad == "AFRICA" || Visibilidad == "ASIA" || Visibilidad == "EUROPA") {
			this->Visibilidad = Visibilidad;
		}
	}

	// Obtener
	string getTipo() {
		return Tipo_de_Eclipse;
	}
	string getFecha() {
		return Fecha;
	}
	int getHora() {
		return Hora;
	}
	char getSismos() {
		return Sismos;
	}
	char getLluvias() {
		return Lluvias;
	}
	string getVisibilidad() {
		return Visibilidad;
	}

	// Eliminar
	void deleteTipo() {
		Tipo_de_Eclipse = "";
		cout << "Eliminado satisfactoriamente";
	}
	void deleteFecha() {
		Fecha = "";
		cout << "Eliminado satisfactoriamente";
	}
	void deleteHora() {
		Hora = 0;
		cout << "Eliminado satisfactoriamente";
	}
	void deleteSismos() {
		Sismos = ' ';
		cout << "Eliminado satisfactoriamente";
	}
	void deleteLluvias() {
		Lluvias = ' ';
		cout << "Eliminado satisfactoriamente";
	}
	void deleteVisibilidad() {
		Visibilidad = "";
		cout << "Eliminado satisfactoriamente";
	}

	// Detalles
	void mostrarDetalles(int i) {
		cout << "\nEclipse: " << i + 1;
		cout << "\nTipo: " << Tipo_de_Eclipse;
		cout << "\nFecha: " << Fecha;
		cout << "\nHora: " << Hora;
		cout << "\nSismos: " << Sismos;
		cout << "\nLluvias: " << Lluvias;
		cout << "\nVisibilidad: " << Visibilidad << endl;
	}
};

// Funcion Principal
int main() {
	// Declaracion de variables
	int opcion;
	int indice = 1;
	int n;
	string tipo, fecha, visibilidad_en_continentes;
	char sismos, lluvias;
	int hora;
	bool Salir = false;

	// Entrada de datos
	cout << "Ingrese la cantidad de eclipses a almacenar: ";
	cin >> n;
	Eclipse *Eclipses = new Eclipse[n];
	system("cls");

	// Interacción con el usuario
	while (true) {
		Salir = false;
		cout << "Interactuando con el Eclipse: " << indice;
		cout << "\n1. Seleccionar por indice";
		cout << "\n2. Modificar";
		cout << "\n3. Eliminar";
		cout << "\n4. Reporte de eclipses visibles en Europa";
		cout << "\n5. Reporte de eclipses que ocasionaron sismos";
		cout << "\n6. Reporte de eclipses que se produjeron en la noche";
		opcion = _getch() - '0';
		switch (opcion) {
			// Seleccionar Indice
		case 1:
			cout << "\nIngrese el indice (1 - " << n << "): ";
			cin >> opcion;
			if (opcion >= 1 && opcion <= n) {
				indice = opcion;
			}
			break;
			// Modificar
		case 2:
			while (!Salir) {
				system("cls");
				cout << "1. Asignar tipo";
				cout << "\n2. Asignar fecha";
				cout << "\n3. Asignar hora";
				cout << "\n4. Asignar ocurrencia de sismos";
				cout << "\n5. Asignar ocurrencia de lluvias";
				cout << "\n6. Asignar ocurrencia en continentes";
				cout << "\n7. Salir";
				opcion = _getch() - '0';
				cout << endl;
				switch (opcion) {
				case 1:
					cout << "Ingrese el tipo (SOLAR - LUNAR): ";
					cin >> tipo;
					Eclipses[indice - 1].setTipo(tipo);
					break;
				case 2:
					cout << "\nIngrese la fecha (dd/mm/aa): ";
					cin >> fecha;
					Eclipses[indice - 1].setFecha(fecha);
					break;
				case 3:
					cout << "\nIngrese la hora (1 - 2400): ";
					cin >> hora;
					Eclipses[indice - 1].setHora(hora);
					break;
				case 4:
					cout << "\nIngrese la ocurrencia de sismos (S / N): ";
					cin >> sismos;
					Eclipses[indice - 1].setSismos(sismos);
					break;
				case 5:
					cout << "\nIngrese la ocurrencia de lluvias (S / N): ";
					cin >> lluvias;
					Eclipses[indice - 1].setLluvias(lluvias);
					break;
				case 6:
					cout << "\nIngrese la visibilidad en continente (AMERICA DEL SUR-EUROPA-AFRICA-AMERICA DEL NORTE-ASIA): ";
					cin >> visibilidad_en_continentes;
					Eclipses[indice - 1].setVisibilidad(visibilidad_en_continentes);
					break;
				case 7:
					cout << "\nSaliendo...";
					Sleep(500);
					Salir = true;
				}
				system("pause>0");
			}
			break;
			// Eliminar
		case 3:
			while (!Salir) {
				system("cls");
				cout << "1. Eliminar tipo";
				cout << "\n2. Eliminar fecha";
				cout << "\n3. Eliminar hora";
				cout << "\n4. Eliminar ocurrencia de sismos";
				cout << "\n5. Eliminar ocurrencia de lluvias";
				cout << "\n6. Eliminar ocurrencia de continentes";
				cout << "\n7. Salir";
				opcion = _getch() - '0';
				cout << endl;
				switch (opcion) {
				case 1:
					Eclipses[indice - 1].deleteTipo();
					break;
				case 2:
					Eclipses[indice - 1].deleteFecha();
					break;
				case 3:
					Eclipses[indice - 1].deleteHora();
					break;
				case 4:
					Eclipses[indice - 1].deleteSismos();
					break;
				case 5:
					Eclipses[indice - 1].deleteLluvias();
					break;
				case 6:
					Eclipses[indice - 1].deleteVisibilidad();
					break;
				case 7:
					cout << "\nSaliendo...";
					Salir = true;
					break;
				}
				system("pause>0");
			}
			break;
			// Mostrar detalles en Europa
		case 4:
			for (int i = 0; i < n; ++i) {
				if (Eclipses[i].getVisibilidad() == "EUROPA") {
					Eclipses[i].mostrarDetalles(i);
				}
			}
			break;
			// Mostrar detalles por sismos
		case 5:
			for (int i = 0; i < n; ++i) {
				if (Eclipses[i].getSismos() == 'S') {
					Eclipses[i].mostrarDetalles(i);
				}
			}
			break;
			// Mostrar detalles en la noche
		case 6:
			for (int i = 0; i < n; ++i) {
				if (Eclipses[i].getTipo() == "LUNAR") {
					Eclipses[i].mostrarDetalles(i);
				}
			}
			break;
		default:
			cout << "\nOpcion invalida, ingrese correctamente la opcion";
			break;
		}
		_getch();
		system("cls");
	}
	delete[] Eclipses;
}
