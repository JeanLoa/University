#include "pch.h"
#include <iostream>
#include <windows.h>
#include <conio.h>
#include <iomanip>

using namespace std;
using namespace System;

void setColor(int textColor, int bgColor) {
	HANDLE hConsole = GetStdHandle(STD_OUTPUT_HANDLE);
	SetConsoleTextAttribute(hConsole, (bgColor << 4) | textColor);
}

class Bala {
private:
	char forma;
	int x, y;
	int dx;
	int color;
	int opcion;
public:
	Bala(int x, int y, int dx, int color, char forma, int opcion) : x(x), y(y), dx(dx), color(color), forma(forma), opcion(opcion) {}
	~Bala() {}
	void dibujar() {
		setColor(color, 0);
		Console::SetCursorPosition(x, y); cout << forma;
	}
	void borrar() {
		Console::SetCursorPosition(x, y); cout << " ";
	}
	void mover() {
		if (opcion == 1) {
			x += dx;
		}
		else if (opcion == 2) {
			x -= dx;
		}
	}
	int getX() {
		return this->x;
	}
	int getY() {
		return this->y;
	}
};

class Disparador {
private:
	int vidas;
	int x, y;
	int dy;
	int color;
	int opcion;
public:
	Disparador(int x, int y, int color, int opcion) : opcion(opcion) {
		this->vidas = 3;
		this->x = x;
		this->y = y;
		this->dy = 1;
		this->color = color;
	}
	~Disparador() {}
	void dibujar() {
		setColor(color, 0);
		switch (opcion) {
		case 1:
			Console::SetCursorPosition(x, y);		cout << "|\\";
			Console::SetCursorPosition(x, y + 1);	cout << "| >";
			Console::SetCursorPosition(x, y + 2);	cout << "|/";
			break;
		case 2:
			Console::SetCursorPosition(x, y);		cout << " /|";
			Console::SetCursorPosition(x, y + 1);	cout << "< |";
			Console::SetCursorPosition(x, y + 2);	cout << " \\|";
			break;
		}
	}
	void borrar() {
		Console::SetCursorPosition(x, y);		cout << "   ";
		Console::SetCursorPosition(x, y + 1);	cout << "   ";
		Console::SetCursorPosition(x, y + 2);	cout << "   ";
	}
	void mover(char input, char top, char down) {
		if (input == top) {
			y -= dy;
		}
		else if (input == down) {
			y += dy;
		}
		if (y < 1) y = 1;
		if (y > 28) y = 28;
	}
	void setVidas(int vidas) {
		this->vidas = vidas;
	}
	int getVidas() {
		return this->vidas;
	}
	int getX() {
		return this->x;
	}
	int getY() {
		return this->y;
	}
	int getColor() {
		return this->color;
	}
};

class Juego {
private:
	Disparador* ObjDisparador1;
	Bala** balas_1;
	int n_Balas_Disparadas_1;
	int n_Stock_Balas_1;

	Disparador* ObjDisparador2;
	Bala** balas_2;
	int n_Balas_Disparadas_2;
	int n_Stock_Balas_2;

	bool juegoTerminado;
public:
	Juego() {
		ObjDisparador1 = new Disparador(1, 13, 4, 1);
		ObjDisparador2 = new Disparador(115, 13, 8, 2);

		balas_1 = nullptr;
		balas_2 = nullptr;

		this->n_Balas_Disparadas_1 = 0;
		this->n_Stock_Balas_1 = 0;

		this->n_Balas_Disparadas_2 = 0;
		this->n_Stock_Balas_2 = 0;
		this->juegoTerminado = false;
	}
	~Juego() {
		delete[] balas_1;
		delete[] balas_2;
		delete ObjDisparador1;
		delete ObjDisparador2;
	}
	void agregarBala(char input) {
		if (input == 'E') {
			++n_Stock_Balas_1;
		}
		else if (input == 'O') {
			++n_Stock_Balas_2;
		}
	}
	void eliminarBala(int opcion, int indice) {
		if (opcion == 1) {
			if (n_Balas_Disparadas_1 > 0) {
				delete balas_1[indice];
				for (int i = indice; i < n_Balas_Disparadas_1 - 1; ++i) {
					balas_1[i] = balas_1[i + 1];
				}
				--n_Balas_Disparadas_1;
			}
		}
		else if (opcion == 2) {
			if (n_Balas_Disparadas_2 > 0) {
				delete balas_2[indice];
				for (int i = indice; i < n_Balas_Disparadas_2 - 1; ++i) {
					balas_2[i] = balas_2[i + 1];
				}
				--n_Balas_Disparadas_2;
			}
		}
	}
	void dispararBala(char input) {
		if (input == 'Q') {
			if (n_Stock_Balas_1 > 0) {
				--n_Stock_Balas_1;
				Bala** copia = new Bala * [n_Balas_Disparadas_1 + 1];
				for (int i = 0; i < n_Balas_Disparadas_1; ++i) {
					copia[i] = balas_1[i];
				}
				copia[n_Balas_Disparadas_1] = new Bala(ObjDisparador1->getX() + 3, ObjDisparador1->getY() + 1, 1, ObjDisparador1->getColor(), '*', 1);
				delete[] balas_1;
				balas_1 = copia;
				++n_Balas_Disparadas_1;
			}
		}
		else if (input == 'U') {
			if (n_Stock_Balas_2 > 0) {
				--n_Stock_Balas_2;
				Bala** copia = new Bala * [n_Balas_Disparadas_2 + 1];
				for (int i = 0; i < n_Balas_Disparadas_2; ++i) {
					copia[i] = balas_2[i];
				}
				copia[n_Balas_Disparadas_2] = new Bala(ObjDisparador2->getX() - 1, ObjDisparador2->getY() + 1, 1, ObjDisparador2->getColor(), '*', 2);
				delete[] balas_2;
				balas_2 = copia;
				++n_Balas_Disparadas_2;
			}
		}
	}
	void actualizarBalas() {
		for (int i = 0; i < n_Balas_Disparadas_1; ++i) {
			balas_1[i]->borrar();
			balas_1[i]->mover();
			balas_1[i]->dibujar();
			if (balas_1[i]->getX() > 118) {
				balas_1[i]->borrar();
				eliminarBala(1, i);
				--i;
			}
		}
		// Actualizar balas del jugador 2
		for (int i = 0; i < n_Balas_Disparadas_2; ++i) {
			balas_2[i]->borrar();
			balas_2[i]->mover();
			balas_2[i]->dibujar();
			if (balas_2[i]->getX() < 1) {
				balas_2[i]->borrar();
				eliminarBala(2, i);
				--i;
			}
		}
	}
	void colision() {
		// Colisiones con el jugador 2
		for (int i = 0; i < n_Balas_Disparadas_1; ++i) {
			if (balas_1[i]->getX() >= ObjDisparador2->getX() &&
				balas_1[i]->getX() <= ObjDisparador2->getX() + 2 &&
				balas_1[i]->getY() >= ObjDisparador2->getY() &&
				balas_1[i]->getY() <= ObjDisparador2->getY() + 2) {

				ObjDisparador2->setVidas(ObjDisparador2->getVidas() - 1);
				eliminarBala(1, i);
				--i;
			}
		}

		// Colisiones con el jugador 1
		for (int i = 0; i < n_Balas_Disparadas_2; ++i) {
			if (balas_2[i]->getX() >= ObjDisparador1->getX() &&
				balas_2[i]->getX() <= ObjDisparador1->getX() + 2 &&
				balas_2[i]->getY() >= ObjDisparador1->getY() &&
				balas_2[i]->getY() <= ObjDisparador1->getY() + 2) {

				ObjDisparador1->setVidas(ObjDisparador1->getVidas() - 1);
				eliminarBala(2, i);
				--i;
			}
		}
	}
	void end() {
		if (ObjDisparador1->getVidas() <= 0) {
			system("cls");
			setColor(ObjDisparador2->getColor(), 0);
			cout << "El Jugador 2 ha ganado";
			juegoTerminado = true;
		}
		else if (ObjDisparador2->getVidas() <= 0) {
			system("cls");
			setColor(ObjDisparador1->getColor(), 0);
			cout << "El Jugador 1 ha ganado";
			juegoTerminado = true;
		}
		setColor(0, 0);
	}
	void iniciarJuego() {
		while (!juegoTerminado) {
			ObjDisparador1->borrar();
			ObjDisparador2->borrar();
			if (_kbhit()) {
				char input = toupper(_getch());
				ObjDisparador1->mover(input, 'W', 'S');
				ObjDisparador2->mover(input, 'I', 'K');

				agregarBala(input);
				dispararBala(input);
			}
			ObjDisparador1->dibujar();
			ObjDisparador2->dibujar();
			actualizarBalas();
			colision();
			mostrarVidas();
			mostrarStock();
			end();
			Sleep(100);
		}
	}
	void mostrarVidas() {
		setColor(ObjDisparador1->getColor(), 0);
		Console::SetCursorPosition(0, 0);
		cout << setw(3) << ObjDisparador1->getVidas();

		setColor(ObjDisparador2->getColor(), 0);
		Console::SetCursorPosition(115, 0);
		cout << setw(3) << ObjDisparador2->getVidas();
	}
	void mostrarStock() {
		setColor(ObjDisparador1->getColor(), 0);
		Console::SetCursorPosition(0, 29);
		cout << setw(3) << this->n_Stock_Balas_1;

		setColor(ObjDisparador2->getColor(), 0);
		Console::SetCursorPosition(115, 29);
		cout << setw(3) << this->n_Stock_Balas_2;
	}
};

int main() {
	srand(time(0));
	Console::CursorVisible = false;
	Juego* ObjJuego = new Juego;
	ObjJuego->iniciarJuego();
	return 0;
}
