#include "pch.h"
#include <iostream>
#include <conio.h>
#include <iomanip>
#include <Windows.h>

using namespace std;
using namespace System;

int randnum(int min, int max) {
    return min + rand() % (max - min + 1);
}

class Astronauta {
private:
    string nombre;
    string especialidad;
public:
    Astronauta(string nombre, string especialidad) : nombre(nombre), especialidad(especialidad) {}
    ~Astronauta() {}
    string getNombre() {
        return nombre;
    }
    string getEspecialidad() {
        return especialidad;
    }
    void setNombre(string nombre) { this->nombre = nombre; }
    void setEspecialidad(string especialidad) { this->especialidad = especialidad; }
};

class ListaAstronautas {
private:
    int n;
    Astronauta** astronautas;
public:
    ListaAstronautas() : n(0), astronautas(nullptr) {}
    void agregarAstronautas(Astronauta* nuevo){
        Astronauta * *copia = new Astronauta * [n + 1];
        for (int i = 0; i < n; ++i) {
            copia[i] = astronautas[i];
        }
        copia[n] = nuevo;
        delete[] astronautas;
        astronautas = copia;
        ++n;
    }
    void modificarAstronauta(int indice, Astronauta* nuevo){
        astronautas[indice] = nuevo;
    }
    void eliminarAstronautas(int indice) {
        if (n > 0) {
            delete astronautas[indice];
            Astronauta** copia = new Astronauta * [n - 1];
            for (int i = indice; i < n - 1; ++i) {
                astronautas[i] = astronautas[i + 1];
            }
            for (int i = 0; i < n - 1; ++i) {
                copia[i] = astronautas[i];
            }
            delete[] astronautas;
            astronautas = copia;
            --n;
        }
    }
    void insertarAstronauta(int indice, Astronauta* nuevo) {
        if (n > 0) {
            Astronauta** copia = new Astronauta * [n + 1];
            for (int i = 0; i < indice; ++i) {
                copia[i] = astronautas[i];
            }
            copia[indice] = nuevo;
            for (int i = indice + 1; i < n + 1; ++i) {
                copia[i] = astronautas[i - 1];
            }
            delete[] astronautas;
            astronautas = copia;
            ++n;
        }
    }
    void mostrarAstronautas() {
        cout << "PASAJEROS DE LA MISION: " << endl;
        for (int i = 0; i < n; ++i) {
            cout << "\t" << setw(8) << astronautas[i]->getNombre() << setw(8) << astronautas[i]->getEspecialidad() << endl;
        }
        for (int i = 0; i < n; ++i) {
            imprimirAstronauta(i);
        }
    }
    void imprimirAstronauta(int i) {
        Console::SetCursorPosition(0 + i * 6, 15); cout << " |";
        Console::SetCursorPosition(0 + i * 6, 16); cout << "-|O|-";
        Console::SetCursorPosition(0 + i * 6, 17); cout << "[[-]]";
        Console::SetCursorPosition(0 + i * 6, 18); cout << "^U-U^";
        Console::SetCursorPosition(0 + i * 6, 19); cout << " H H";
    }
    int getN() {
        return n;
    }
};

// Animacion
class Cohete {
private:
    string nombre = "SPACE-CONQUER";
    int x, y;
    int dx, dy;
public:
    Cohete() {
        this->x = 10;
        this->y = 25;
        this->dx = 1;
        this->dy = -2;
    }
    ~Cohete(){}
    void dibujarCohete() {
        Console::SetCursorPosition(x, y);           cout << "  .";
        Console::SetCursorPosition(x, y + 1);       cout << " |o|";
        Console::SetCursorPosition(x, y + 2);       cout << "|.-.|";
        Console::SetCursorPosition(x, y + 3);       cout << ".   .";
    }
    void borrarCohete() {
        Console::SetCursorPosition(x, y);       cout << "     ";
        Console::SetCursorPosition(x, y + 1);   cout << "     ";
        Console::SetCursorPosition(x, y + 2);   cout << "     ";
        Console::SetCursorPosition(x, y + 3);   cout << "     ";
    }
    void moverCohete() {
        x += dx;
        y += dy;
    }
    int getX() {
        return x;
    }
    int getY() {
        return y;
    }
    void setX(int x) {
        this->x = x;
    }
    void setY(int y) {
        this->y = y;
    }
};

class Despegue {
private:
    Cohete* cohete;
public:
    Despegue(Cohete* cohete) { this->cohete = cohete; }
    ~Despegue(){}
    void Luna() {
        Console::SetCursorPosition(25, 0); cout << "    ;;;;";
        Console::SetCursorPosition(25, 1); cout << "  ;;;;;;;;";
        Console::SetCursorPosition(25, 2); cout << ";;;;;;;;;;;;";
        Console::SetCursorPosition(25, 3); cout << "  ;;;;;;;;";
        Console::SetCursorPosition(25, 4); cout << "    ;;;;";

    }
    void IniciaDespegue(){
        Luna();
        while (true) {
            cohete->borrarCohete();
            cohete->moverCohete();
            cohete->dibujarCohete();
            if (cohete->getY() < 5) {
                break;
            }
            Sleep(500);
        }
    }
};
int main()
{
    Cohete* cohete = new Cohete;
    Despegue* despegue;
    ListaAstronautas* lista = new ListaAstronautas;
    Astronauta* ObjAstronauta;

    string nombre, especialidad;
    int opcion;
    int indice;
    while (true) {
        cohete->setX(10);
        cohete->setY(25);
        system("cls");
        cout << "MISION CONQUISTA AL ESPACIO";
        cout << "\n-.-.-.-.-.-.-.-.-.-.-.-.-.-";
        cout << "\n[1] : Mostrar astronautas";
        cout << "\n[2] : Agregar astronauta";
        cout << "\n[3] : Modificar astronauta";
        cout << "\n[4] : Eliminar astronauta";
        cout << "\n[5] : Insertar astronauta";
        cout << "\n[6] : Despegar cohete";
        cout << "\nElija una opcion: ";
        cin >> opcion;
        system("cls");
        switch (opcion) {
        case 1:
            lista->mostrarAstronautas();
            break;
        case 2:
            cout << "Ingrese el nombre: ";
            cin >> nombre;
            cout << "Ingrese la especialidad: ";
            cin >> especialidad;
            ObjAstronauta = new Astronauta(nombre, especialidad);
            lista->agregarAstronautas(ObjAstronauta);
            break;
        case 3:
            if (lista->getN() > 0) {
                cout << "Ingrese el indice a modificar (0 - " << lista->getN() - 1 << "): ";
                cin >> indice;
                cout << "Ingrese el nombre: ";
                cin >> nombre;
                cout << "Ingrese la especialidad: ";
                cin >> especialidad;
                ObjAstronauta = new Astronauta(nombre, especialidad);
                lista->modificarAstronauta(indice, ObjAstronauta);
            }
            else {
                cout << "No hay astronautas";
            }
            break;
        case 4:
            if (lista->getN() > 0) {
                cout << "Ingrese el indice a eliminar (0 -" << lista->getN() - 1 << "): ";
                cin >> indice;
                lista->eliminarAstronautas(indice);
            }
            else {
                cout << "No hay astronautas";
            }
            break;
        case 5:
            if (lista->getN() > 0) {
                cout << "Ingrese el indice a insertar (0 - " << lista->getN() - 1 << "): ";
                cin >> indice;
                cout << "Ingrese el nombre: ";
                cin >> nombre;
                cout << "Ingrese la especialidad: ";
                cin >> especialidad;
                ObjAstronauta = new Astronauta(nombre, especialidad);
                lista->insertarAstronauta(indice, ObjAstronauta);
            }
            else {
                cout << "No hay astronautas";
            }
            break;
        case 6:
            despegue = new Despegue(cohete);
            despegue->IniciaDespegue();
            break;
        default:
            cout << "Ingrese una opcion valida";
            break;
        }
        system("pause>0");
    }

    return 0;
}
