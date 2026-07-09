#include "MyForm.h"
using namespace System::Windows::Forms;

int main() {
    Application::EnableVisualStyles();
    Application::SetCompatibleTextRenderingDefault(false);
    Application::Run(gcnew Proyecto::MyForm);
    return 0;
}
