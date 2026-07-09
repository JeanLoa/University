#include <iostream>
#include <vector>
#include <conio.h>
#include <windows.h>
using namespace std;

// Funciones Auxiliares
int randnum(int min, int max) {
	return min + rand() % (max - min + 1);
}
void Hidecursor(bool visibility) {
	// Estructura para almacenar la información del cursor
	CONSOLE_CURSOR_INFO cursorInfo;
	// Obtener la información actual del cursor
	GetConsoleCursorInfo(GetStdHandle(STD_OUTPUT_HANDLE), &cursorInfo);
	// Configurar la visibilidad del cursor
	cursorInfo.bVisible = visibility;
	// Aplicar los cambios
	SetConsoleCursorInfo(GetStdHandle(STD_OUTPUT_HANDLE), &cursorInfo);
}

// Funciones
void ActualizarTamaño(int*&Arreglo, int tamaño, int& n) {
	delete[] Arreglo;
	n = tamaño;
	Arreglo = new int[tamaño];
}
void Agregar(int*& Arreglo, int& n, int elemento) {
	int* Copia = new int[n + 1];
	for (int i = 0; i < n; ++i) {
		Copia[i] = Arreglo[i];
	}
	Copia[n] = elemento;
	delete[] Arreglo;
	Arreglo = Copia;
	++n;
	cout << "Elemento agregado satisfactoriamente" << endl;
	system("pause");
}

void Eliminar(int* &Arreglo, int indice) {
	Arreglo[indice] = 0;
	cout << "Elementos eliminado satisfactoriamente" << endl;
	system("pause");
}
void Mostrar(int*Arreglo, int n) {
	for (int i = 0; i < n; ++i) {
		cout << "Arreglo [" << i << "]: " << Arreglo[i] << endl;
	}
	system("pause");
}
void GenerarArreglo(int*&Arreglo, int n) {
	for (int i = 0; i < n; ++i) {
		Arreglo[i] = randnum(1, 20);
	}
	cout << "\nElementos generados satisfactoriamente" << endl;
	system("pause");
}
void AgregarAlPrincipio(int*& Arreglo, int n, int elemento) {
	for (int i = n - 1; i >= 0; --i) {
		Arreglo[i + 1] = Arreglo[i];
	}
	Arreglo[0] = elemento;
	cout << "Elemento agregado satisfactoriamente" << endl;
	system("pause");
}

// Función Principal
int main() {
	srand(time(nullptr));
	Hidecursor(false);
	int n;
	int elemento;
	int opcion;
	int* Arreglo;
	do {
		cout << "Ingrese el tamano del Arreglo de numeros (1 - 30): ";
		cin >> n;
	} while (n <= 0 && n > 30);
	Arreglo = new int[n];
	while (true) {
		system("cls");
		cout << "\n1. Actualizar tamano";
		cout << "\n2. Agregar elemento";
		cout << "\n3. Eliminar elemento";
		cout << "\n4. Mostrar elementos";
		cout << "\n5. Rellenar Arreglo con elementos aleatorios";
		cout << "\n6. Agregar elemento al principio";
		cout << "\n7. Salir";
		opcion = _getch() - '0';
		switch (opcion) {
		case 1:
			do {
				system("cls");
				cin.clear();
				cout << "Ingrese el tamaño: ";
				cin >> elemento;
				cin.ignore(1000, '\n');
			} while (elemento < 0 || cin.fail());
			ActualizarTamaño(Arreglo, elemento, n);
			break;
		case 2:
			do {
				system("cls");
				cout << "Ingrese el elemento a anadir: ";
				cin >> elemento;
			} while (elemento < 0  && elemento >= n);
			Agregar(Arreglo, n, elemento);
			break;
		case 3:
			do {
				system("cls");
				cout << "Ingrese el indice a eliminar (0" << "-" << n-1 << "): ";
				cin >> elemento;
			} while (elemento < 0 && elemento >= n);
			Eliminar(Arreglo, elemento);
			break;
		case 4:
			system("cls");
			Mostrar(Arreglo, n);
			break;
		case 5:
			GenerarArreglo(Arreglo, n);
			break;
		case 6:
			do {
				system("cls");
				cin.clear();
				cout << "Ingrese un elemento: ";
				cin >> elemento;
				cin.ignore(1000, '\n');
			} while (cin.fail());
			AgregarAlPrincipio(Arreglo, n, elemento);
			break;
		case 7:
			system("cls");
			cout << "Saliendo del programa...";
			Sleep(200);
			delete[] Arreglo;
			return 0;
		default:
			system("cls");
			cout << "Ingrese una opcion valida";
			Sleep(500);
			break;
		}
	}
}
