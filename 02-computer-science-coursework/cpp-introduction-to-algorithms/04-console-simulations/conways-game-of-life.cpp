#include <iostream>
#include <conio.h>
#include <Windows.h>

using namespace std;

char Block = 219;

void HideCursor() {
	HANDLE consoleHandle = GetStdHandle(STD_OUTPUT_HANDLE);
	CONSOLE_CURSOR_INFO info;
	info.dwSize = 100;
	info.bVisible = FALSE;
	SetConsoleCursorInfo(consoleHandle, &info);
}

int randnum(int min, int max) {
	return min + rand() % (max - min + 1);
}

void setColor(int textColor, int bgColor) {
	int colorAtribute = textColor << 4 | bgColor;
	SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), colorAtribute);
}

void resetColor(int textColor, int bgColor) {
	setColor(7, 0);
}

void GenerarMatriz(int** Datos, int n, int m) {
	for (int i = 0; i < n; ++i) {
		for (int j = 0; j < m; ++j) {
			Datos[i][j] = (randnum(1, 5) == 5) ? 1 : 0;
		}
	}
}

void ActualizarMatriz(int** Datos, int n, int m) {
	int** NuevaMatriz = new int*[n];
	for (int i = 0; i < n; ++i) {
		NuevaMatriz[i] = new int[m];
	}
	for (int i = 0; i < n; ++i) {
		for (int j = 0; j < m; ++j) {
			int VecinosVivos = 0;
			for (int k = -1; k <= 1; ++k) {
				for (int l = -1; l <= 1; ++l) {
					if (k == 0 && l == 0) continue;
					int ni = i + k;
					int nj = j + l;
					if (ni >= 0 && ni < n && nj >= 0 && nj < m) {
						VecinosVivos += Datos[ni][nj];
					}
				}
			}
			(Datos[i][j] == 1) ? (NuevaMatriz[i][j] = (VecinosVivos == 2 || VecinosVivos == 3) ? 1 : 0) : 0;
			(Datos[i][j] == 0) ? (NuevaMatriz[i][j] = (VecinosVivos == 3) ? 1 : 0) : 0;
		}
	}
	for (int i = 0; i < n; ++i) {
		for (int j = 0; j < m; ++j) {
			Datos[i][j] = NuevaMatriz[i][j];
		}
		delete[] NuevaMatriz[i];
	}
	delete[] NuevaMatriz;
}

void ImprimirMatriz(int** Datos, int n, int m) {
	for (int i = 0; i < n; ++i) {
		for (int j = 0; j < m; ++j) {
			if (Datos[i][j] == 1) {
				cout << Block;
			}
			else {
				cout << " ";
			}
		}
		cout << endl;
	}
}

int main() {
	srand(time(0));
	HideCursor();
	int n, m;
	int i = 0;
	do {
		if (i >= 1) {
			cout << "Se ha ingresado datos fuera del rango\n";
		}
		cout << "Ingrese el largo de la Automata (1 - 30): ";
		cin >> n;
		cout << "Ingrese el ancho de la Automata (1 - 50): ";
		cin >> m;
		++i;
		system("cls");
	} while (n > 30 || n <= 0 || m > 50 || m <= 0);
	int** Automata = new int*[n];
	for (int i = 0; i < n; ++i) {
		Automata[i] = new int[m];
	}

	i = 0;
	GenerarMatriz(Automata, n, m);
	while (i < 100) {
		cout << "Esta es la iteracion " << i + 1 << endl;
		ImprimirMatriz(Automata, n, m);
		_getch();
		ActualizarMatriz(Automata, n, m);
		system("cls");
		++i;
	}
	cout << "Se acabaron las iteraciones";
}
