#include <iostream>
#include <iomanip>
#include <conio.h>
using namespace std;

int randnum(int min, int max) {
	return min + rand() % (max - min + 1);
}

class Encuestado {
private:
	string DNI;
	char TIPO;
public:
	Encuestado() : DNI(8, '0'), TIPO('1') {}
	Encuestado(string DNI, char TIPO) : DNI(DNI), TIPO(TIPO) {}
	void setDNI(string DNI) {
		this->DNI = DNI;
	}
	void setTIPO(char TIPO) {
		this->TIPO = TIPO;
	}
	string getDNI() {
		return DNI;
	}
	char getTIPO() {
		return TIPO;
	}
	void generarDNI() {
		for (int i = 0; i < 8; ++i) {
			DNI[i] = '0' + randnum(0, 8);
		}
	}
	void generarTIPO() {
		TIPO = '0' + randnum(1, 4);
	}
};

class ListaEncuestado {
private:
	Encuestado** arreglo;
	int N;
public:
	ListaEncuestado() : arreglo(nullptr), N(0) {}
	~ListaEncuestado() {
		for (int i = 0; i < N; ++i) {
			delete[] arreglo[i];
		}
		delete arreglo;
	}
	int getN() {
		return N;
	}
	void agregarEncuestado(Encuestado* nuevo) {
		Encuestado** copia = new Encuestado*[N+1];
		for (int i = 0; i < N; ++i) {
			copia[i] = arreglo[i];
		}
		copia[N] = nuevo;
		delete[] arreglo;
		arreglo = copia;
		++N;
	}

	void eliminarEncuestado(string DNI) {
		int indice = -1;
		for (int i = 0; i < N; ++i) {
			if (arreglo[i]->getDNI() == DNI) {
				indice = i;
				delete arreglo[i];
				break;
			}
		}
		if (indice == -1) {
			cout << "\nEl DNI no ha sido encontrado";
			return;
		}
		for (int i = 0; i < N - 1; ++i) {
			arreglo[i] = arreglo[i + 1];
		}
		--N;
		if (N > 0) {
			Encuestado** copia = new Encuestado*[N];
			for (int i = 0; i < N; ++i) {
				copia[i] = arreglo[i];
			}
			delete[] arreglo;
			arreglo = copia;
		}
		else {
			delete[] arreglo;
			arreglo = nullptr;
		}
		cout << "\nEl DNI especificado ha sido eliminado";
	}

	void mostrarDatos() {
		cout << "-----------------------\n";
		cout << "| " << left << setw(9) << "DNI";
		cout << "| " << setw(9) << "TIPO";
		cout << "|\n";
		cout << "-----------------------";
		for (int i = 0; i < N; ++i) {
			cout << "\n| " << setw(9) << arreglo[i]->getDNI();
			cout << "| " << setw(9) << arreglo[i]->getTIPO();
			cout << "|\n";
			cout << "-----------------------";
		}
	}
};

int main() {
	srand(time(0));
	ListaEncuestado* lista;
	Encuestado* encuestado;
	lista = new ListaEncuestado;
	string DNI;
	char TIPO;
	int opcion;
	while (true) {
		cout << "1. Agregar encuestado";
		cout << "\n2. Generar aleatoriamente encuestado";
		cout << "\n3. Eliminar encuestado";
		cout << "\n4. Mostrar encuestado";
		cout << "\n5. Salir";
		opcion = _getch() - '0';
		system("cls");
		switch (opcion) {
		case 1:
			cout << "Ingrese el DNI: ";
			cin >> DNI;
			cout << "Ingrese el TIPO(1 - 4): ";
			cin >> TIPO;
			encuestado = new Encuestado(DNI, TIPO);
			lista->agregarEncuestado(encuestado);
			break;
		case 2:
			encuestado = new Encuestado();
			encuestado->generarDNI();
			encuestado->generarTIPO();
			lista->agregarEncuestado(encuestado);
			break;
		case 3:
			cout << "Ingrese el DNI: ";
			cin >> DNI;
			lista->eliminarEncuestado(DNI);
			break;
		case 4:
			lista->mostrarDatos();
			break;
		case 5:
			return 0;
			break;
		default:
			cout << "Selecione una opcion valida";
			break;
		}
		system("pause>0");
		system("cls");
	}
	
	return 0;
}
