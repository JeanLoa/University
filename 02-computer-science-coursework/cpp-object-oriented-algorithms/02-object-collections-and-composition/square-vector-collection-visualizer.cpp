#include "pch.h"
#include <iostream>
#include <conio.h>
#include <windows.h>
#include <iomanip>
using namespace std;
using namespace System;

void setColor(int textColor, int bgColor) {
    HANDLE hConsole = GetStdHandle(STD_OUTPUT_HANDLE);
    SetConsoleTextAttribute(hConsole, (bgColor << 4) | textColor);
}
void resetColor() {
    setColor(7, 0);
}

int randnum(int min, int max) {
    int num = 0;
    while (num == 0) {
        num = min + rand() % (max - min + 1);
    }
    return num;
}

class Cuadrado {
private:
    char forma;
    int x, y;
    int dx, dy;
    int color;
public:
    Cuadrado(char forma, int x, int y, int dx, int dy, int color) : forma(forma), x(x), y(y), dx(dx), dy(dy), color(color) {}
    ~Cuadrado(){}
    void dibujar() {
        setColor(color, 0);
        Console::SetCursorPosition(x, y);     cout << forma << forma << forma;
        Console::SetCursorPosition(x, y + 1); cout << forma << forma << forma;
        resetColor();
    }
    void borrar() {
        Console::SetCursorPosition(x, y);     cout << "   ";
        Console::SetCursorPosition(x, y + 1); cout << "   ";
    }
    void mover() {
        if (x < 50 && y == 0) {
            x += dx;
        }
        else if (x == 50 && y < 25) {
            y += dy;
        }
        else if (x > 0 && y == 25) {
            x -= dx;
        }
        else if (x == 0 && y > 0) {
            y -= dy;
        }
    }
    int getX() {
        return this->x;
    }
    int getY() {
        return this->y;
    }
    void asignarColor(int color) {
        this->color = color;
    }
};

class VectorDeCuadrados {
private:
    Cuadrado** cuadrados;
    int n;
public:
    VectorDeCuadrados() : cuadrados(nullptr), n(0){}
    ~VectorDeCuadrados() {
        for (int i = 0; i < n; ++i) {
            delete cuadrados[i];
        }
        delete[] cuadrados;
    }
    void agregarCuadrado() {
        Cuadrado* nuevo = new Cuadrado(219, 0, 0, 1, 1, randnum(0, 15));
        Cuadrado** copia = new Cuadrado * [n + 1];
        for (int i = 0; i < n; ++i) {
            copia[i] = cuadrados[i];
        }
        copia[n] = nuevo;
        delete[] cuadrados;
        cuadrados = copia;
        ++n;
    }
    void eliminarCuadrado() {
        if (n > 0) {
            cuadrados[0]->borrar();
            delete cuadrados[0];
            Cuadrado** copia = new Cuadrado * [n - 1];
            for (int i = 1; i < n; ++i) {
                copia[i - 1] = cuadrados[i];
            }
            delete[] cuadrados;
            cuadrados = copia;
            --n;
        }
    }
    void cambiarColor() {
        for (int i = 0; i < n; ++i) {
            cuadrados[i]->asignarColor(randnum(0, 15));
        }
    }
    void moverCuadrados() {
        for (int i = 0; i < n; ++i) {
            cuadrados[i]->borrar();
            cuadrados[i]->mover();
            cuadrados[i]->dibujar();
        }
    }
    void Carrera() {
        while (true) {
            Console::SetCursorPosition(0, 29); cout << "Cuadrados: " << setw(3) << getN();
            moverCuadrados();
            if (_kbhit()) {
                char input = toupper(_getch());
                if (input == 'A') {
                    agregarCuadrado();
                }
                if (input == 'E') {
                    eliminarCuadrado();
                }
                if (input == 'C') {
                    cambiarColor();
                }
            }
            Sleep(50);
        }
    }
    int getN() {
        return this->n;
    }
};

int main() {
    Console::CursorVisible = false;
    srand(time(0));
    VectorDeCuadrados* ObjVector = new VectorDeCuadrados;
    ObjVector->Carrera();
    return 0;
}
