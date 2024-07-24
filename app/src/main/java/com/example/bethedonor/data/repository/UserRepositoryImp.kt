package com.example.bethedonor.data.repository

import com.example.bethedonor.data.api.ApiService
import com.example.bethedonor.data.api.LogInRequest
import com.example.bethedonor.data.api.ProfileResponse
import com.example.bethedonor.data.api.RegistrationRequest
import com.example.bethedonor.domain.model.User
import com.example.bethedonor.domain.repository.UserRepository
import okhttp3.ResponseBody
import retrofit2.Response

class UserRepositoryImp(private val apiService: ApiService) : UserRepository {
    override suspend fun registerUser(user: User): Response<ResponseBody> {
        val request = RegistrationRequest(
            user.name,
            user.email,
            user.phoneNumber,
            user.dob,
            user.gender,
            user.bloodGroup,
            user.state,
            user.city,
            user.district,
            user.pin,
            user.password,
            user.available
        )
        return apiService.register(request)
    }

    override suspend fun loginUser(email: String, password: String): Response<ResponseBody> {
        val request = LogInRequest(email, password)
        return apiService.login(request)
    }

    override suspend fun getUserProfile(token: String): Response<ProfileResponse> {
        return apiService.getProfile("Bearer $token")
    }
}
