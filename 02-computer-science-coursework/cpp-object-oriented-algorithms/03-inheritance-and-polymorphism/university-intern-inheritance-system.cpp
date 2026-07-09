#include "pch.h"
#include <iostream>
#include <unordered_map>
#include <conio.h>
#include <string>

using namespace System;
using namespace std;

class Persona {
private:
	string nombre;
	string edad;
	string cargo;
public:
	Persona(){}
	Persona(string nombre, string edad, string cargo) : nombre(nombre), edad(edad), cargo(cargo){}
	~Persona(){}
	string getNombre() {
		return this->nombre;
	}
	string getEdad() {
		return this->edad;
	}
	string getCargo() {
		return this->cargo;
	}
};

class Estudiante : public virtual Persona {
private:
	string dni;
	string nivel_de_estudios;
public:
	Estudiante(){}
	Estudiante(string nombre, string edad, string cargo, string dni, string nivel): Persona(nombre, edad, cargo), dni(dni), nivel_de_estudios(nivel) {}
	~Estudiante(){}
	string getDni() {
		return this->dni;
	}
	string getNivel() {
		return this->nivel_de_estudios;
	}
};

class Empleado : public virtual Persona {
private:
	string empresa;
public:
	Empleado(){}
	Empleado(string nombre, string edad, string cargo, string empresa): Persona(nombre, edad, cargo), empresa(empresa) {}
	~Empleado(){}
	string getEmpresa() {
		return this->empresa;
	}
};

class Universitario : public Estudiante {
private:
	string nombre_de_universidad;
	string carrera;
	string* materias;
	int n_materias;
	int* notas;
	int n_notas;
public:
	Universitario(){}
	Universitario(string nombre, string edad, string cargo, string dni, string nivel, string nombre_de_universidad, string carrera, string* materias, int n_materias, int* notas, int n_notas)
		: Estudiante(nombre, edad, cargo, dni, nivel), nombre_de_universidad(nombre_de_universidad), carrera(carrera) {
		this->materias = new string[n_materias];
		this->n_materias = n_materias;
		for (int i = 0; i < n_materias; ++i) {
			for (char& c : materias[i]) {
				c = toupper(c);
			}
		}
		for (int i = 0; i < n_materias; ++i) {
			this->materias[i] = materias[i];
		}
		this->notas = new int[n_notas];
		this->n_notas = n_notas;
		for (int i = 0; i < n_notas; ++i) {
			this->notas[i] = notas[i];
		}
	}
	~Universitario() {
		delete[] notas;
		delete[] materias;
	}
	string getUniversidad() {
		return this->nombre_de_universidad;
	}
	string getCarrera() {
		return this->carrera;
	}
	string getMaterias() {
		string result = "";
		for (int i = 0; i < n_materias; ++i) {
			result += materias[i] + " ";
		}
		return result;	
	}
	string getNotas() {
		string result = "";
		for (int i = 0; i < n_notas; ++i) {
			result += to_string(notas[i]) + " ";
		}
		return result;
	}
	const int* getNotas_Array() const {
		return this->notas;
	}
	int getN_materias() {
		return n_materias;
	}
	int getN_notas() {
		return n_notas;
	}
};

class Pasante : public Universitario, public Empleado {
private:
	string nombre_del_proyecto;
	int total_horas;
	int horas_completadas;
public:
	Pasante(){}
	Pasante(string nombre, string edad, string cargo, string dni, string nivel,
		string nombre_de_universidad, string carrera, string* materias,
		int n_materias, int* notas, int n_notas, string empresa,
		string nombre_del_proyecto, int total_horas, int horas_completadas):
		Persona(nombre, edad, cargo),
		Universitario(nombre, edad, cargo, dni, nivel, nombre_de_universidad, carrera, materias, n_materias, notas, n_notas),
		Empleado(nombre, edad, cargo, empresa) {
		for (char& c : nombre) {
			c = toupper(c);
		}
		for (char& c : edad) {
			c = toupper(c);
		}
		for (char& c : cargo) {
			c = toupper(c);
		}
		for (char& c : dni) {
			c = toupper(c);
		}
		for (char& c : nivel) {
			c = toupper(c);
		}
		for (char& c : nombre_de_universidad) {
			c = toupper(c);
		}
		for (char& c : carrera) {
			c = toupper(c);
		}
		for (char& c : empresa) {
			c = toupper(c);
		}
		for (char& c : nombre_del_proyecto) {
			c = toupper(c);
		}
		this->total_horas = total_horas;
		this->horas_completadas = horas_completadas;
	}
	~Pasante(){}
	string getProyecto() {
		return nombre_del_proyecto;
	}
	int getTotalHoras() {
		return total_horas;
	}
	int getHorasCompletadas() {
		return horas_completadas;
	}
};

class ListaPasantes {
private:
	int n;
	Pasante** pasantes;
public:
	ListaPasantes(): n(0), pasantes(nullptr) {}
	~ListaPasantes() {
		delete[] pasantes;
	}
	void agregarPasante(Pasante* nuevo) {
		Pasante** copia = new Pasante * [n + 1];
		for (int i = 0; i < n; ++i) {
			copia[i] = pasantes[i];
		}
		copia[n] = nuevo;
		delete[] pasantes;
		pasantes = copia;
		++n;
	}
	void eliminarPasante(int indice) {
		if (n > 0) {
			Pasante** copia = new Pasante * [n - 1];
			delete pasantes[indice];
			for (int i = indice; i < n - 1; ++i) {
				pasantes[i] = pasantes[i + 1];
			}
			for (int i = 0; i < n - 1; ++i) {
				copia[i] = pasantes[i];
			}
			delete pasantes;
			pasantes = copia;
			--n;
		}
	}
	void modificarPasante(Pasante* nuevo, int indice) {
		if (n > 0) {
			pasantes[indice] = nuevo;
		}
	}
	void insertarPasante(Pasante* nuevo, int indice) {
		if (n > 0) {
			Pasante** copia = new Pasante * [n + 1];
			for (int i = 0; i <= indice - 1; ++i) {
				copia[i] = pasantes[i];
			}
			copia[indice] = nuevo;
			for (int i = indice; i < n; ++i) {
				copia[i + 1] = pasantes[i];
			}
			delete[] pasantes;
			pasantes = copia;
			++n;
		}
	}
	void mostrarUniversidadPredominanteEnEmpresas(string empresa) {
		for (char& c : empresa) {
			c = toupper(c);
		}
		vector<int> indices;
		tuple<string, int> universidadPredominante = make_tuple("", 0);
		unordered_map <string, int> ConteoDeUniversidades;
		for (int i = 0; i < n; ++i) {
			string universidad = pasantes[i]->getUniversidad();
			if (pasantes[i]->getEmpresa() == empresa) {
				ConteoDeUniversidades[universidad]++;
				if (ConteoDeUniversidades[universidad] > get<1>(universidadPredominante)) {
					get<1>(universidadPredominante) = ConteoDeUniversidades[universidad];
					get<0>(universidadPredominante) = universidad;
				}
			}
		}
		for (int i = 0; i < n; ++i) {
			if (pasantes[i]->getUniversidad() == get<0>(universidadPredominante)) {
				indices.push_back(i);
			}
		}
		cout << "La universidad con mas pasantes en " << empresa << " es: " << get<0>(universidadPredominante) << " con " << get<1>(universidadPredominante) << " pasantes";
		for (int i : indices) {
			cout << "\nPasante " << i + 1 << ": ";
			cout << "\nNombre: " << pasantes[i]->getNombre();
			cout << "\nEdad: " << pasantes[i]->getEdad();
			cout << "\nCargo: " << pasantes[i]->getCargo();
			cout << "\nDNI: " << pasantes[i]->getDni();
			cout << "\nNivel de estudios: " << pasantes[i]->getNivel();
			cout << "\nEmpresa: " << pasantes[i]->getEmpresa();
			cout << "\nCarrera: " << pasantes[i]->getCarrera();
			cout << "\nMaterias: " << pasantes[i]->getMaterias();
			cout << "\nNotas: " << pasantes[i]->getNotas();
			cout << "\nProyecto: " << pasantes[i]->getProyecto();
			cout << "\nTotal de horas: " << pasantes[i]->getTotalHoras();
			cout << "\nHoras completadas: " << pasantes[i]->getHorasCompletadas();
			cout << endl << endl;
		}
	}
	void mostrarPromedios() {
		float promedio_de_notas = 0;
		int suma_de_notas = 0;
		const int* notas;
		for (int i = 0; i < n; ++i) {
			cout << "Pasante " << i + 1 << ": ";
			cout << "\nNombre: " << pasantes[i]->getNombre();
			cout << "\nEdad: " << pasantes[i]->getEdad();
			cout << "\nCargo: " << pasantes[i]->getCargo();
			cout << "\nDNI: " << pasantes[i]->getDni();
			cout << "\nNivel de estudios: " << pasantes[i]->getNivel();
			cout << "\nPromedio de notas: ";
			for (int j = 0; j < pasantes[i]->getN_notas(); ++j) {
				notas = pasantes[i]->getNotas_Array();
				suma_de_notas += notas[j];
			}
			promedio_de_notas = float(suma_de_notas) / pasantes[i]->getN_notas();
			cout << promedio_de_notas;
			cout << endl << endl;
		}
	}
	int getN() {
		return n;
	}
};

int main() {
	// Objetos
	ListaPasantes* ObjLista = new ListaPasantes;
	Pasante* ObjPasante;

	// Variables
	int opcion, indice;
	int n_materias, n_notas, total_horas, horas_completadas;
	string nombre, edad, cargo, dni, nivel_de_estudios, empresa, universidad, carrera, * materias, proyecto;
	int* notas;

	while (true) {
		system("cls");
		cout << "1. Agregar pasante";
		cout << "\n2. Eliminar pasante";
		cout << "\n3. Modificar pasante";
		cout << "\n4. Insertar pasante";
		cout << "\n5. Universidad con mas pasantes en una empresa";
		cout << "\n6. Promedio de los pasantes";
		cout << "\n7. Salir";
		opcion = _getch() - '0';
		system("cls");
		switch (opcion) {
		case 1:
			cout << "Ingrese el nombre: ";
			cin >> nombre;
			cout << "Ingrese la edad: ";
			cin >> edad;
			cout << "Ingrese el cargo: ";
			cin >> cargo;
			cout << "Ingrese el DNI: ";
			cin >> dni;
			cout << "Ingrese el nivel: ";
			cin >> nivel_de_estudios;
			cout << "Ingrese la empresa: ";
			cin >> empresa;
			cout << "Ingrese la universidad: ";
			cin >> universidad;
			cout << "Ingrese la carrera: ";
			cin >> carrera;
			cout << "Ingrese la cantidad de materias: ";
			cin >> n_materias;
			materias = new string[n_materias];
			cout << "Ingrese las materias: ";
			for (int i = 0; i < n_materias; ++i) {
				cin >> materias[i];
			}
			cout << "Ingrese la cantidad de notas: ";
			cin >> n_notas;
			notas = new int[n_notas];
			cout << "Ingrese las notas: ";
			for (int i = 0; i < n_notas; ++i) {
				cin >> notas[i];
			}
			cout << "Ingrese el nombre del proyecto: ";
			cin >> proyecto;
			cout << "Ingrese la cantidad de horas: ";
			cin >> total_horas;
			cout << "Ingrese la cantidad de horas completadas: ";
			cin >> horas_completadas;
			ObjPasante = new Pasante(nombre, edad, cargo, dni, nivel_de_estudios, universidad, carrera, materias, n_materias, notas, n_notas, empresa, proyecto, total_horas, horas_completadas);
			ObjLista->agregarPasante(ObjPasante);
			break;
		case 2:
			cout << "Ingrese el indice a eliminar (0 - " << ObjLista->getN() - 1 << "): ";
			cin >> indice;
			ObjLista->eliminarPasante(indice);
			break;
		case 3:
			cout << "Ingrese el indice a modificar (0 - " << ObjLista->getN() - 1 << "): ";
			cin >> indice;
			cout << "Ingrese el nombre: ";
			cin >> nombre;
			cout << "Ingrese la edad: ";
			cin >> edad;
			cout << "Ingrese el cargo: ";
			cin >> cargo;
			cout << "Ingrese el DNI: ";
			cin >> dni;
			cout << "Ingrese el nivel: ";
			cin >> nivel_de_estudios;
			cout << "Ingrese la empresa: ";
			cin >> empresa;
			cout << "Ingrese la universidad: ";
			cin >> universidad;
			cout << "Ingrese la carrera: ";
			cin >> carrera;
			cout << "Ingrese la cantidad de materias: ";
			cin >> n_materias;
			materias = new string[n_materias];
			cout << "Ingrese las materias: ";
			for (int i = 0; i < n_materias; ++i) {
				cin >> materias[i];
			}
			cout << "Ingrese la cantidad de notas: ";
			cin >> n_notas;
			notas = new int[n_notas];
			cout << "Ingrese las notas: ";
			for (int i = 0; i < n_notas; ++i) {
				cin >> notas[i];
			}
			cout << "Ingrese el nombre del proyecto: ";
			cin >> proyecto;
			cout << "Ingrese la cantidad de horas: ";
			cin >> total_horas;
			cout << "Ingrese la cantidad de horas completadas: ";
			cin >> horas_completadas;
			ObjPasante = new Pasante(nombre, edad, cargo, dni, nivel_de_estudios, universidad, carrera, materias, n_materias, notas, n_notas, empresa, proyecto, total_horas, horas_completadas);
			ObjLista->modificarPasante(ObjPasante, indice);
			break;
		case 4:
			cout << "Ingrese el indice a insertar (0 - " << ObjLista->getN() - 1 << "): ";
			cin >> indice;
			cout << "Ingrese el nombre: ";
			cin >> nombre;
			cout << "Ingrese la edad: ";
			cin >> edad;
			cout << "Ingrese el cargo: ";
			cin >> cargo;
			cout << "Ingrese el DNI: ";
			cin >> dni;
			cout << "Ingrese el nivel: ";
			cin >> nivel_de_estudios;
			cout << "Ingrese la empresa: ";
			cin >> empresa;
			cout << "Ingrese la universidad: ";
			cin >> universidad;
			cout << "Ingrese la carrera: ";
			cin >> carrera;
			cout << "Ingrese la cantidad de materias: ";
			cin >> n_materias;
			materias = new string[n_materias];
			cout << "Ingrese las materias: ";
			for (int i = 0; i < n_materias; ++i) {
				cin >> materias[i];
			}
			cout << "Ingrese la cantidad de notas: ";
			cin >> n_notas;
			notas = new int[n_notas];
			cout << "Ingrese las notas: ";
			for (int i = 0; i < n_notas; ++i) {
				cin >> notas[i];
			}
			cout << "Ingrese el nombre del proyecto: ";
			cin >> proyecto;
			cout << "Ingrese la cantidad de horas: ";
			cin >> total_horas;
			cout << "Ingrese la cantidad de horas completadas: ";
			cin >> horas_completadas;
			ObjPasante = new Pasante(nombre, edad, cargo, dni, nivel_de_estudios, universidad, carrera, materias, n_materias, notas, n_notas, empresa, proyecto, total_horas, horas_completadas);
			ObjLista->insertarPasante(ObjPasante, indice);
			break;
		case 5:
			cout << "Ingrese la empresa a buscar: ";
			cin >> empresa;
			ObjLista->mostrarUniversidadPredominanteEnEmpresas(empresa);
			break;
		case 6:
			ObjLista->mostrarPromedios();
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
	delete ObjLista;
	delete ObjPasante;
	delete[] notas;
	delete[] materias;
}
