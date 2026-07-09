#include <iostream>
#include <iomanip>

using namespace std;

void Km_a_M(float Km) {
    float m = Km * 1000;
    cout << "La distancia " << Km << " kilometros equivale a " << m << " metros";
}

int main() {
    int Km;
    cout << "Ingresa los kilometros a convertir: ";
    cin >> Km;
    Km_a_M(Km);

    return 0;
}
