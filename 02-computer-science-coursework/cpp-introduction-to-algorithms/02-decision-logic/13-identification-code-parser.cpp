#include <iostream>
#include <string>

using namespace std;

int main() {
    string codigo;
    cout << "Ingrese el codigo de identificacion: ";
    cin >> codigo;
    char LetraNombre = stoi(codigo.substr(0, 2));
    char LetraApellidoP = stoi(codigo.substr(2, 2));
    char LetraApellidoM = stoi(codigo.substr(4, 2));
    int Hora = stoi(codigo.substr(6, 2));
    int Minuto = stoi(codigo.substr(8, 2));
    int Segundo = stoi(codigo.substr(10, 2));
    string Tardanza = (Hora >= 9 && Minuto > 0 && Segundo > 0) ? "V" : "F";
    cout << "\nDatos del empleado registrado con codigo: " << codigo;
    cout << "\nLa primera letra del nombre es: " << LetraNombre;
    cout << "\nLa primera letra del apellido paterno es: " << LetraApellidoP;
    cout << "\nLa primera letra del apellido materno es: " << LetraApellidoM;
    cout << "\nIngreso en la hora: " << Hora;
    cout << "\nIngreso en el minuto: " << Minuto;
    cout << "\nIngreso en el segundo: " << Segundo;
    cout << "\nTardanza: " << Tardanza;

    return 0;
}
