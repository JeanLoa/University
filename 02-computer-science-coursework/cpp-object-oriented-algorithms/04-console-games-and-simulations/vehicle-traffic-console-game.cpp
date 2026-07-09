#include "pch.h"
#include <iostream>
#include <windows.h>
#include <conio.h>
using namespace std;
using namespace System;

void setColor(int textColor, int bgColor) {
	HANDLE hConsole = GetStdHandle(STD_OUTPUT_HANDLE);
	SetConsoleTextAttribute(hConsole, (bgColor << 4) | textColor);
}
int randnum(int min, int max) {
	return min + rand() % (max - min + 1);
}
int randX() {
	return randnum(10, 100);
}

int randY() {
	return randnum(2, 23);
}

int randDX() {
	return (randnum(1, 2) == 1) ? 1 : -1;
}

class Terrestre {
protected:
	float x, y;
	float dx;
	int color;
public:
	Terrestre(float x, float y, float dx, int color) : x(x), y(y), dx(dx), color(color) {}
	~Terrestre() {}
	virtual void dibujar() = 0;
	virtual void borrar() = 0;
	virtual void mover() = 0;
	int getX() {
		return int(this->x);
	}
	int getY() {
		return int(this->y);
	}
	void setDX(float dx) {
		this->dx = dx;
	}
};

class Carro : public Terrestre {
public:
	Carro(float x, float y, float dx, int color) : Terrestre(x, y, dx, color) {}
	~Carro() {}
	void dibujar() override {
		setColor(color, 0);
		Console::SetCursorPosition(x, y);	  cout << "_____|~\\_";
		Console::SetCursorPosition(x, y + 1); cout << "[_____|_|-";
		Console::SetCursorPosition(x, y + 2); cout << "(_)  (_)";
	}
	void borrar() override {
		Console::SetCursorPosition(x, y);	  cout << "         ";
		Console::SetCursorPosition(x, y + 1); cout << "          ";
		Console::SetCursorPosition(x, y + 2); cout << "        ";
	}
	void mover() {
		float vx = 0.2;
		if (x > 100) x = 100, dx *= -1;
		if (x < 10) x = 10, dx *= -1;
		if (dx > 3 || dx < 0.1) vx *= -1;
		dx += vx;
		x += dx;
	}
};

class Bus : public Terrestre {
public:
	Bus(float x, float y, float dx, int color) : Terrestre(x, y, dx, color) {}
	~Bus() {}
	void dibujar() override {
		setColor(color, 0);
		Console::SetCursorPosition(x, y);	  cout << "  _________________";
		Console::SetCursorPosition(x, y + 1); cout << "_/_|[][][][][][][]|";
		Console::SetCursorPosition(x, y + 2); cout << " (                |";
		Console::SetCursorPosition(x, y + 3); cout << "=--OO-----------OO-=";
	}
	void borrar() override {
		Console::SetCursorPosition(x, y);	  cout << "                   ";
		Console::SetCursorPosition(x, y + 1); cout << "                   ";
		Console::SetCursorPosition(x, y + 2); cout << "                   ";
		Console::SetCursorPosition(x, y + 3); cout << "                    ";
	}
	void mover() {
		float vx = 0.2;
		if (x > 100) x = 100, dx *= -1;
		if (x < 10) x = 10, dx *= -1;
		if (dx > 3 || dx < 0.1) vx *= -1;
		dx += vx;
		x += dx;
	}
};

class Bicicleta : public Terrestre {
public:
	Bicicleta(float x, float y, float dx, int color) : Terrestre(x, y, dx, color) {}
	~Bicicleta() {}
	void dibujar() override {
		setColor(color, 0);
		Console::SetCursorPosition(x, y);	  cout << " .._\\";
		Console::SetCursorPosition(x, y + 1); cout << "(o)(o)";
	}
	void borrar() override {
		Console::SetCursorPosition(x, y);	  cout << "     ";
		Console::SetCursorPosition(x, y + 1); cout << "      ";
	}
	void mover() {
		x += dx;
		if (x > 100) x = 100, dx *= -1;
		if (x < 10) x = 10, dx *= -1;
	}
};

class Persona {
private:
	char forma;
	int x, y;
	int dx, dy;
	int color;
public:
	Persona(int x, int y, int dx, int dy, int color, char forma) : x(x), y(y), dx(dx), dy(dy), color(color), forma(forma) {}
	~Persona() {}
	void dibujar() {
		setColor(color, 0);
		Console::SetCursorPosition(x, y); cout << forma;
	}
	void borrar() {
		Console::SetCursorPosition(x, y); cout << " ";
	}
	void mover(char input) {
		if (input == 'W') y -= dy;
		else if (input == 'A') x -= dx;
		else if (input == 'S') y += dy;
		else if (input == 'D') x += dx;

		if (x > 100) x = 100;
		else if (x < 10) x = 10;
		else if (y > 29) x = 29;
		else if (y < 0) y = 0;
	}
	int getX() {
		return this->x;
	}
	int getY() {
		return this->y;
	}
};

class Juego {
private:
	Persona* heroe;
	Carro** carros;
	int n_Carros;
	Bus** buses;
	int n_Buses;
	Bicicleta** bicicletas;
	int n_Bicicletas;
public:
	Juego() {
		heroe = new Persona(60, 29, 1, 1, 15, 254);
		this->n_Carros = randnum(2, 3);
		this->n_Buses = randnum(1, 2);
		this->n_Bicicletas = randnum(5, 6);
		carros = new Carro * [n_Carros];
		buses = new Bus * [n_Buses];
		bicicletas = new Bicicleta * [n_Bicicletas];
		for (int i = 0; i < n_Carros; ++i) {
			carros[i] = new Carro(randX(), randY(), randDX(), randnum(1, 15));
		}
		for (int i = 0; i < n_Buses; ++i) {
			buses[i] = new Bus(randX(), randY(), randDX(), randnum(1, 15));
		}
		for (int i = 0; i < n_Bicicletas; ++i) {
			bicicletas[i] = new Bicicleta(randX(), randY(), randDX(), randnum(1, 15));
		}
	}
	~Juego() {
		delete heroe;
		for (int i = 0; i < n_Carros; ++i) {
			delete carros[i];
		}
		delete[] carros;
		for (int i = 0; i < n_Buses; ++i) {
			delete buses[i];
		}
		delete[] buses;
		for (int i = 0; i < n_Bicicletas; ++i) {
			delete bicicletas[i];
		}
		delete[] bicicletas;
	}
	void moverVehiculos() {
		for (int i = 0; i < n_Carros; ++i) {
			carros[i]->borrar();
			carros[i]->mover();
			carros[i]->dibujar();
		}
		for (int i = 0; i < n_Buses; ++i) {
			buses[i]->borrar();
			buses[i]->mover();
			buses[i]->dibujar();
		}
		for (int i = 0; i < n_Bicicletas; ++i) {
			bicicletas[i]->borrar();
			bicicletas[i]->mover();
			bicicletas[i]->dibujar();
		}
	}
	void colision() {
		for (int i = 0; i < n_Carros; ++i) {
			if (heroe->getX() >= carros[i]->getX() && heroe->getX() <= carros[i]->getX() + 9 && heroe->getY() >= carros[i]->getY() && heroe->getY() <= carros[i]->getY() + 2) {
				system("cls");
				cout << "Has colisionado con un carro";
				exit(0);
			}
		}
		for (int i = 0; i < n_Buses; ++i) {
			if (heroe->getX() >= buses[i]->getX() && heroe->getX() <= buses[i]->getX() + 19 && heroe->getY() >= buses[i]->getY() && heroe->getY() <= buses[i]->getY() + 3) {
				system("cls");
				cout << "Has colisionado con un bus";
				exit(0);
			}
		}
		for (int i = 0; i < n_Bicicletas; ++i) {
			if (heroe->getX() >= bicicletas[i]->getX() && heroe->getX() <= bicicletas[i]->getX() + 5 && heroe->getY() >= bicicletas[i]->getY() && heroe->getY() <= bicicletas[i]->getY() + 1) {
				system("cls");
				cout << "Has colisionado con una bicicleta";
				exit(0);
			}
		}
	}
	void victoria() {
		if (heroe->getY() < 2) {
			system("cls");
			setColor(15, 0);
			cout << "El heroe ha cruzado la pista";
			setColor(0, 0);
			exit(0);
		}
	}
	void iniciarJuego() {
		cout << "Presiona la tecla G para empezar a cruzar la pista";
		while (true) {
			if (_kbhit()) {
				char input = toupper(_getch());
				if (input == 'G') {
					while (true) {
						heroe->borrar();
						if (_kbhit()) {
							char input = toupper(_getch());
							heroe->mover(input);
						}
						heroe->dibujar();
						moverVehiculos();
						colision();
						victoria();
						Sleep(100);
					}
				}
			}
		}
	}
};

int main() {
	Console::CursorVisible = false;
	srand(time(0));
	Juego* ObjJuego = new Juego;
	ObjJuego->iniciarJuego();

	return 0;
}
