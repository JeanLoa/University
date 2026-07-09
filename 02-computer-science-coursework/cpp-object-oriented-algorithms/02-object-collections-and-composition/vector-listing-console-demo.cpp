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
void ActualizarTamaño(vector<int>& Vector, int tamaño) {
	Vector.resize(tamaño);
}
void Agregar(vector<int>& Vector, int elemento) {
	Vector.push_back(elemento);
	cout << "Elemento agregado satisfactoriamente" << endl;
	system("pause");
}
void Eliminar(vector<int>& Vector, int indice) {
	Vector.erase(Vector.begin() + indice);
	cout << "Elementos eliminado satisfactoriamente" << endl;
	system("pause");
}
void Mostrar(vector<int> Vector) {
	for (int i = 0; i < Vector.size(); ++i) {
		cout << "Vector[" << i << "]: " << Vector[i] << endl;
	}
	system("pause");
}
void GenerarVector(vector<int>& Vector) {
	for (int i = 0; i < Vector.size(); ++i) {
		Vector[i] = randnum(1, 20);
	}
	cout << "\nElementos generados satisfactoriamente" << endl;
	system("pause");
}
void AgregarAlPrincipio(vector<int>& Vector, int elemento) {
	Vector.insert(Vector.begin(), elemento);
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
	vector<int> Vector;
	do {
		cout << "Ingrese el tamano del Vector de numeros (1 - 30): ";
		cin >> n;
	} while (n <= 0 && n > 30);
	Vector.resize(n);
	while (true) {
		system("cls");
		cout << "\n1. Actualizar tamano";
		cout << "\n2. Agregar elemento";
		cout << "\n3. Eliminar elemento";
		cout << "\n4. Mostrar elementos";
		cout << "\n5. Rellenar Vector con elementos aleatorios";
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
			ActualizarTamaño(Vector, elemento);
			break;
		case 2:
			do {
				system("cls");
				cout << "Ingrese el elemento a anadir: ";
				cin >> elemento;
			} while (elemento < 0  && elemento >= Vector.size());
			Agregar(Vector, elemento);
			break;
		case 3:
			do {
				system("cls");
				cout << "Ingrese el indice a eliminar (0" << "-" << Vector.size()-1 << "): ";
				cin >> elemento;
			} while (elemento < 0 && elemento >= Vector.size());
			Eliminar(Vector, elemento);
			break;
		case 4:
			system("cls");
			Mostrar(Vector);
			break;
		case 5:
			GenerarVector(Vector);
			break;
		case 6:
			do {
				system("cls");
				cin.clear();
				cout << "Ingrese un elemento: ";
				cin >> elemento;
				cin.ignore(1000, '\n');
			} while (cin.fail());
			AgregarAlPrincipio(Vector, elemento);
			break;
		case 7:
			system("cls");
			cout << "Saliendo del programa...";
			Sleep(200);
			return 0;
		default:
			system("cls");
			cout << "Ingrese una opcion valida";
			Sleep(500);
			break;
		}
	}
}
