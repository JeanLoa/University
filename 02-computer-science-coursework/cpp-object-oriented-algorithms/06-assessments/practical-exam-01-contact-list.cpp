#include <iostream>
#include <conio.h>
#include <iomanip>
using namespace std;

class Contacto {
public:
    Contacto() {}
    Contacto(string nombre, string apellido, string telefono) : nombre(nombre), apellido(apellido), telefono(telefono) {}
    ~Contacto() {}
    void setNombre(string nombre) { this->nombre = nombre; }
    void setApellido(string apellido) { this->apellido = apellido; }
    void setTelefono(string telefono) { this->telefono = telefono; }
    string getNombre() const { return nombre; }
    string getApellido() const { return apellido; }
    string getTelefono() const { return telefono; }

private:
    string nombre;
    string apellido;
    string telefono;
};

class ListaContacto {
public:
    ListaContacto() : n(0), arreglo(nullptr) {}
    ~ListaContacto() {
        for (int i = 0; i < n; ++i) {
            delete arreglo[i];
        }
        delete[] arreglo;
    }

    void GenerarContacto(Contacto* contacto) {
        Contacto** copia = new Contacto * [n + 1];
        for (int i = 0; i < n; ++i) {
            copia[i] = arreglo[i];
        }
        copia[n] = contacto;
        delete[] arreglo;
        arreglo = copia;
        ++n;
    }

    void ImprimirListaContactos() const {
        system("cls");
        cout << left << setw(15) << "Nombre" << setw(15) << "Apellido" << setw(15) << "Telefono" << endl;
        for (int i = 0; i < n; ++i) {
            cout << left << setw(15) << arreglo[i]->getNombre()
                << setw(15) << arreglo[i]->getApellido()
                << setw(15) << arreglo[i]->getTelefono()
                << endl;
        }
    }

    void EliminarContacto(int indice) {
        if (indice >= 0 && indice < n) {
            delete arreglo[indice];
            for (int i = indice; i < n - 1; ++i) {
                arreglo[i] = arreglo[i + 1];
            }
            --n;
            Contacto** copia = new Contacto * [n];
            for (int i = 0; i < n; ++i) {
                copia[i] = arreglo[i];
            }
            delete[] arreglo;
            arreglo = copia;
            cout << "\nEl contacto fue eliminado satisfactoriamente.\n";
        }
        else {
            cout << "\nIndice invalido.\n";
        }
    }

    int getTamaño() const { return n; }

private:
    int n;
    Contacto** arreglo;
};

// Función principal
int main() {
    int opcion;
    int indice;
    string nombre, apellido, telefono;
    ListaContacto* ObjLista = new ListaContacto;
    Contacto* ObjContacto;

    while (true) {
        system("cls");
        cout << "Menu:";
        cout << "\n1. Lista de Contactos";
        cout << "\n2. Agregar Contacto";
        cout << "\n3. Eliminar Contacto";
        cout << "\n4. Salir";
        opcion = _getch() - '0';
        switch (opcion) {
        case 1:
            ObjLista->ImprimirListaContactos();
            system("pause>0");
            break;
        case 2:
            system("cls");
            cout << "Ingrese el nombre: ";
            cin >> nombre;
            cout << "Ingrese el apellido: ";
            cin >> apellido;
            cout << "Ingrese el telefono: ";
            cin >> telefono;
            ObjContacto = new Contacto(nombre, apellido, telefono);
            ObjLista->GenerarContacto(ObjContacto);
            system("pause>0");
            break;
        case 3:
            do {
                system("cls");
                cout << "Ingrese el indice a eliminar (0 - " << ObjLista->getTamaño() - 1 << "): ";
                cin >> indice;
                if (cin.fail()) {
                    cin.clear();
                    cin.ignore(numeric_limits<streamsize>::max(), '\n');
                    indice = -1;
                }
            } while (indice < 0 || indice >= ObjLista->getTamaño());
            ObjLista->EliminarContacto(indice);
            system("pause>0");
            break;
        case 4:
            delete ObjLista;
            return 0;
        default:
            cout << "\nOpcion invalida";
            system("pause>0");
            break;
        }
    }
}
