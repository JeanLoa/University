#include "pch.h"
#include <iostream>
#include <windows.h>
#include <conio.h>
#include <iomanip>

using namespace System;
using namespace std;

void setColor(int color) {
	HANDLE hConsole = GetStdHandle(STD_OUTPUT_HANDLE);
	SetConsoleTextAttribute(hConsole, color);
}

class Bala {
private:
	int x, y;
	char forma;
	int dx, dy;
	int opcion;
	int color;
public:
	Bala(int x, int y, char forma, int dx, int dy, int opcion, int color): x(x), y(y), forma(forma), dx(dx), dy(dy), opcion(opcion), color(color){}
	~Bala(){}
	void borrar() {
		Console::SetCursorPosition(x, y);
		cout << " ";
	}
	void mover() {
		switch (opcion) {
		case 1:
			if ((x >= 0 && x < 119) && y == 0) {
				x += dx;
			}
			else if ((y >= 0 && y < 28) && x == 119) {
				y += dy;
			}
			else if ((x <= 119 && x > 0) && y == 28) {
				x -= dx;
			}
			else if ((y <= 28 && y > 0) && x == 0) {
				y -= dy;
			}
			break;
		case 2:
			if ((x <= 80 && x > 40) && y == 20) {
				x -= dx;
			}
			else if ((y <= 20 && y > 10) && x == 40) {
				y -= dy;
			}
			else if ((x >= 40 && x < 80) && y == 10) {
				x += dx;
			}
			else if ((y >= 10 && y < 20) && x == 80) {
				y += dy;
			}
		}
	}
	void dibujar() {
		setColor(color);
		Console::SetCursorPosition(x, y);
		cout << forma;
	}
};

class Disparador {
private:
	Bala** balas;
	int n;
	int x, y;
	char forma;
	int color;
public:
	Disparador(int x, int y, char forma, int color) : balas(nullptr), n(0), x(x), y(y), forma(forma), color(color){}
	~Disparador(){}
	void dibujarDisparador() {
		setColor(color);
		Console::SetCursorPosition(x, y);
		cout << forma;
	}
	void agregarBala(Bala* nuevo) {
		Bala** copia = new Bala * [n + 1];
		for (int i = 0; i < n; ++i) {
			copia[i] = balas[i];
		}
		copia[n] = nuevo;
		delete[] balas;
		balas = copia;
		++n;
	}
	void eliminarBala() {
		if (n > 0) {
			balas[n - 1]->borrar();
			delete balas[n - 1];
			Bala** copia = new Bala * [n - 1];
			for (int i = 0; i < n - 1; ++i) {
				copia[i] = balas[i];
			}
			delete[] balas;
			balas = copia;
			--n;
		}
	}
	void moverBalas() {
		for (int i = 0; i < n; ++i) {
			balas[i]->borrar();
			balas[i]->mover();
			balas[i]->dibujar();
		}
	}
	void mostrarBalas(int x, int y) {
		setColor(color);
		Console::SetCursorPosition(x, y);
		cout << "Balas: " << setw(3) << getN();
	}
	int getN() {
		return n;
	}
};

int main() {
	Disparador* ObjDisparador1 = new Disparador(0, 0, 219, 1);
	Disparador* ObjDisparador2 = new Disparador(80, 20, 219, 4);
	Bala* ObjBala;
	while (true) {
    	ObjDisparador1->dibujarDisparador();
	    ObjDisparador2->dibujarDisparador();
		ObjDisparador1->mostrarBalas(0, 29);
		ObjDisparador2->mostrarBalas(110, 29);
		ObjDisparador1->moverBalas();
		ObjDisparador2->moverBalas();
		if (_kbhit()) {
			char input = toupper(_getch());
			if (input == 'A') {
				ObjBala = new Bala(1, 0, '*', 1, 1, 1, 1);
				ObjDisparador1->agregarBala(ObjBala);
			}
			else if (input == 'E') {
				ObjDisparador1->eliminarBala();
			}
			if (input == 'M') {
				ObjBala = new Bala(79, 20, '*', 1, 1, 2, 4);
				ObjDisparador2->agregarBala(ObjBala);
			}
			else if (input == 'X') {
				ObjDisparador2->eliminarBala();
			}
		}
		Sleep(50);
	}

	return 0;
}
