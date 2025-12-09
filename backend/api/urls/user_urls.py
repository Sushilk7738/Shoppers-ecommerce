from django.urls import path
from api.view import user_views as views

urlpatterns = [
    path('register/', views.registerUser, name="register"),
    path('profile/', views.getUserProfile, name='user_profile'),
    path('profile/update/', views.updateUserProfile, name= "user_update_profile"),
    path('login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('update/<str:pk>/', views.updateUser, name='updateUser'),
    path('delete/<str:pk>/', views.deleteUser, name='deleteUser'),
]
