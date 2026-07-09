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

float randD() {
	float d = randnum(1, 3);
	switch (int(d)) {
	case 1:
		d = 1;
		break;
	case 2:
		d = 0;
		break;
	case 3:
		d = -1;
		break;
	}
	return d;
}

class Animal {
protected:
	int x, y;
	int dx, dy;
	int color;
public:
	Animal(float x, float y, float dx, float dy, int color) : x(x), y(y), dx(dx), dy(dy), color(color) {}
	~Animal() {}
	virtual void dibujar() = 0;
	virtual void borrar() = 0;
	virtual void mover(char input = 0) = 0;
	int getX() {
		return this->x;
	}
	int getY() {
		return this->y;
	}
	void setDX(int dx) {
		this->dx = dx;
	}
};

class Gato : public Animal {
public:
	Gato(int x, int y, int dx, int dy, int color) : Animal(x, y, dx, dy, color){}
	~Gato() {}
	void dibujar() override {
		setColor(color, 0);
		Console::SetCursorPosition(x, y);	  cout << " /\\_/\\";
		Console::SetCursorPosition(x, y + 1); cout << "( o.o )";
		Console::SetCursorPosition(x, y + 2); cout << " > ^ <";
	}
	void borrar() override {
		Console::SetCursorPosition(x, y);	  cout << "      ";
		Console::SetCursorPosition(x, y + 1); cout << "       ";
		Console::SetCursorPosition(x, y + 2); cout << "      ";
	}
	void mover(char input) override {
		if (input == 'W') y -= dy;
		else if (input == 'A') x -= dx;
		else if (input == 'S') y += dy;
		else if (input == 'D') x += dx;
		
		if (x < 0) x = 0;
		else if (x > 115) x = 115;
		else if (y < 0) y = 0;
		else if (y > 27) y = 27;
	}
};

class Raton : public Animal {
public:
	Raton(int x, int y, int dx, int dy, int color) : Animal(x, y, dx, dy, color){}
	~Raton(){}
	void dibujar() override {
		setColor(color, 0);
		Console::SetCursorPosition(x, y); cout << "--(_c'>";
	}
	void borrar() override {
		Console::SetCursorPosition(x, y); cout << "       ";
	}
	void mover(char input) override {}
	void mover(int x, int y) {
		if (this->x >= x && this->x <= x + 6) this->x += randD();
		else if (this->x < x) this->x -= dx;
		else if (this->x > x) this->x += dx;

		if (this->y >= y && this->y <= y + 2) this->y += randD();
		else if (this->y < y) this->y -= dy;
		else if (this->y > y) this->y += dy;

		if (this->x < 0) this->x = 0;
		if (this->x > 110) this->x = 110;
		if (this->y < 0) this->y = 0;
		if (this->y > 29) this->y = 29;
	}
};

class Juego {
private:
	Gato* gato;
	Raton** ratones;
	int n_Ratones;
	int ratones_cazados;
	float ratones_totales;
	float contador;
public:
	Juego() {
		this->contador = 0;
		this->ratones_cazados = 0;
		this->n_Ratones = randnum(7, 15);
		this->ratones_totales = n_Ratones;
		gato = new Gato(60, 15, 3, 3, 3);
		ratones = new Raton * [n_Ratones];
		for (int i = 0; i < n_Ratones; ++i) {
			ratones[i] = new Raton(randX(), randY(), 1, 1, 8);
		}
	}
	~Juego() {
		delete gato;
		for (int i = 0; i < n_Ratones; ++i) {
			delete ratones[i];
		}
		delete[] ratones;
	}
	void eliminarRaton(int indice) {
		if (n_Ratones > 0) {
			ratones[indice]->borrar();
			delete ratones[indice];
			Raton** copia = new Raton * [n_Ratones - 1];
			for (int i = indice; i < n_Ratones - 1; ++i) {
				ratones[i] = ratones[i + 1];
			}
			for (int i = 0; i < n_Ratones - 1; ++i) {
				copia[i] = ratones[i];
			}
			delete[] ratones;
			ratones = copia;
			--n_Ratones;
		}
	}
	void agregarRaton() {
		if (contador >= 2) {
			Raton** copia = new Raton * [n_Ratones + 1];
			for (int i = 0; i < n_Ratones; ++i) {
				copia[i] = ratones[i];
			}
			copia[n_Ratones] = new Raton(randX(), randY(), 1, 1, 8);
			delete[] ratones;
			ratones = copia;
			++n_Ratones;
			++ratones_totales;
			contador = 0;
		}
	}
	void moverRatones() {
		for (int i = 0; i < n_Ratones; ++i) {
			ratones[i]->borrar();
			ratones[i]->mover(gato->getX(), gato->getY());
			ratones[i]->dibujar();
		}
	}
	void colision() {
		for (int i = 0; i < n_Ratones; ++i) {
			bool eliminado = false;
			for (int dx = 0; dx < 7; ++dx) {
				for (int dy = 0; dy < 3; ++dy) {
					int x = gato->getX();
					int y = gato->getY();
					if (x + dx >= ratones[i]->getX() && x + dx <= ratones[i]->getX() + 6 &&
						y + dy >= ratones[i]->getY() && y + dy <= ratones[i]->getY()) {
						eliminarRaton(i);
						ratones_cazados++;
						eliminado = true;
						break;
					}
				}
				if (eliminado) break;
			}
			if (eliminado) --i;
		}
	}
	bool vic() {
		bool end;
		if (ratones_cazados >= ratones_totales / 2) {
			end = true;
		}
		else {
			end = false;
		}
		return end;
	}
	float getContador() {
		return this->contador;
	}
	void setContador(float contador) {
		this->contador = contador;
	}
	void iniciarJuego() {
		bool victoria = false;
		while (!victoria) {
			gato->borrar();
			if (_kbhit()) {
				char input = toupper(_getch());
				gato->mover(input);
			}
			gato->dibujar();
			moverRatones();
			colision();
			setContador(getContador() + 0.1);
			agregarRaton();
			victoria = vic();
			Sleep(100);
		}
		system("cls");
		setColor(4, 0);
		cout << "Haz cazado a " << ratones_cazados << " de " << ratones_totales;
		setColor(0, 0);
		Sleep(3000);
	}
};

int main() {
	Console::CursorVisible = false;
	srand(time(0));
	Juego* ObjJuego = new Juego;
	ObjJuego->iniciarJuego();
	return 0;
}
