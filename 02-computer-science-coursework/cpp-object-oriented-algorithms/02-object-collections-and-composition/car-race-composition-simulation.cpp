#include "pch.h"
#include <windows.h>
#include <iostream>
#include <conio.h>

using namespace System;
using namespace std;

void setColor(int color) {
	HANDLE hConsole = GetStdHandle(STD_OUTPUT_HANDLE);
	SetConsoleTextAttribute(hConsole, color);
}

class Chasis {
private:
	char forma;
	float x, y;
public:
	Chasis(char forma, float x, float y) : forma(forma), x(x), y(y) {}
	~Chasis() {}
	void dibujarChasis() {
		Console::SetCursorPosition(int(x), int(y));
		cout << forma << forma << forma << forma << forma;
	}
	void setX(float x) {
		this->x = x;
	}
};
class Llanta {
private:
	char forma;
	float x, y;
public:
	Llanta(char forma, float x, float y) : forma(forma), x(x), y(y) {}
	~Llanta() {}
	void dibujarLlanta() {
		Console::SetCursorPosition(int(x), int(y));
		cout << forma;
	}
	void setX(float x) {
		this->x = x;
	}
};
class Carro {
private:
	Chasis* chasis;
	Llanta** llantas;
	float x, y;
	float dx;
	int color;
public:
	Carro(float x, float y, int color) {
		this->x = x;
		this->y = y;
		this->dx = 0.1 + (float)rand() / RAND_MAX;
		this->color = color;
		chasis = new Chasis(220, x, y + 1);
		llantas = new Llanta * [4];
		llantas[0] = new Llanta(219, x, y);
		llantas[1] = new Llanta(219, x + 2, y);
		llantas[2] = new Llanta(219, x, y + 2);
		llantas[3] = new Llanta(219, x + 2, y + 2);
	}
	void borrarCarro() {
		Console::SetCursorPosition(int(x), int(y));		 cout << "      ";
		Console::SetCursorPosition(int(x), int(y) + 1); cout << "      ";
		Console::SetCursorPosition(int(x), int(y) + 2);  cout << "      ";
	}
	void moverCarro() {
		x += dx;
		llantas[0]->setX(x);
		llantas[1]->setX(x + 2);
		llantas[2]->setX(x);
		llantas[3]->setX(x + 2);
		chasis->setX(x);
	}
	void dibujarCarro() {
		setColor(color);
		for (int i = 0; i < 4; ++i) {
			llantas[i]->dibujarLlanta();
		}
		chasis->dibujarChasis();
	}
	float getX() {
		return x;
	}
};

class Competencia {
private:
	Carro** carros = new Carro * [3];
public:
	Competencia() {
		carros[0] = new Carro(0, 10, 4);
		carros[1] = new Carro(0, 15, 8);
		carros[2] = new Carro(0, 20, 2);
	}
	void IniciarCarrera(char input) {
		int i;
		for (i = 0; i < 3; ++i) {
			carros[i]->dibujarCarro();
		}
		while (true) {
			for (int i = 0; i < 3; ++i) {
				carros[i]->borrarCarro();
				carros[i]->moverCarro();
				carros[i]->dibujarCarro();
				if (carros[i]->getX() > 100) {
					system("cls");
					cout << "El carro " << i + 1 << " ha ganado";
					exit(0);
				}
			}
			Sleep(50);
		}
	}
};

int main() {
	srand(time(0));
	char input;
	Competencia* ObjCarrera = new Competencia;
	cout << "Presiona la tecla G para comenzar la carrera";
	while (true) {
		if (_kbhit()) {
			system("cls");
			input = toupper(_getch());
			if (input == 'G') {
				ObjCarrera->IniciarCarrera(input);
			}
		}
	}
	return 0;
}
