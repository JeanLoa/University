#include <iostream>
#include <iomanip>

using namespace std;

int main() {
    int horastrabajadas;
    cout << "Ingrese las horas trabajadas: ";
    cin >> horastrabajadas;
    float sueldo = (horastrabajadas <= 0) ? 0 :
                   (horastrabajadas <= 40) ? horastrabajadas * 16 :
                   40 * 16 + (horastrabajadas - 40) * 20;
    (sueldo == 0) ? cout << "El dato ingresado no es valido", exit(0) : (void)0;

    cout << fixed << setprecision(2);
    cout << "El sueldo del empleado es: $" << sueldo;

    return 0;
}
