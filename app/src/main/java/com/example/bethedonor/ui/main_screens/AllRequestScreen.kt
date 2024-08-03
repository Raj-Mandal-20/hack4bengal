package com.example.bethedonor.ui.main_screens

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import com.example.bethedonor.data.dataModels.RequestCardDetails
import com.example.bethedonor.ui.components.AllRequestCard
import com.example.bethedonor.ui.components.FilterItemComponent
import com.example.bethedonor.ui.components.SearchBarComponent
import com.example.bethedonor.ui.temporay_screen.LoadingScreen
import com.example.bethedonor.ui.theme.bgDarkBlue
import com.example.bethedonor.ui.theme.fadeBlue11
import com.example.bethedonor.utils.dateDiffInDays
import com.example.bethedonor.utils.formatDate
import com.example.bethedonor.utils.getCityList
import com.example.bethedonor.utils.getDistrictList
import com.example.bethedonor.utils.getPinCodeList
import com.example.bethedonor.utils.getStateDataList
import com.example.bethedonor.utils.isDeadlinePassed
import com.example.bethedonor.viewmodels.AllRequestViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AllRequestScreen(
    navController: NavController,
    innerPadding: PaddingValues,
    token: String,
    userId: String,
    allRequestViewModel: AllRequestViewModel = viewModel()
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val allBloodRequestResponseList by allRequestViewModel.allBloodRequestResponseList.collectAsState(
        null
    )
    val isLoading by allRequestViewModel.isRequestFetching.collectAsState()
    val searchText by allRequestViewModel.searchText.collectAsState()
    val filterState by allRequestViewModel.filterState.collectAsState()
    val filterDistrict by allRequestViewModel.filterDistrict.collectAsState()
    val filterCity by allRequestViewModel.filterCity.collectAsState()
    val filterPin by allRequestViewModel.filterPin.collectAsState()
    val isSheetVisible by allRequestViewModel.isSheetVisible.collectAsState()
    val sheetState = rememberModalBottomSheetState()

    //   val isSearching by allRequestViewModel.isSearching.collectAsState()
    LaunchedEffect(Unit) {
        allRequestViewModel.getAllBloodRequest(token)
    }
    Scaffold(topBar = {
        TopAppBarComponent(
            searchText,
            allRequestViewModel,
            filterState,
            filterDistrict,
            filterCity,
            filterPin
        )

    }, containerColor = bgDarkBlue) { it ->
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier.padding(
                start = 8.dp,
                end = 8.dp,
            )
        ) {
            Surface(color = bgDarkBlue) {
                allBloodRequestResponseList?.let { result ->
                    result.fold(
                        onSuccess = { bloodRequestsWithUsers ->
                            LazyColumn {
                                item {
                                    Spacer(modifier = Modifier.height(it.calculateTopPadding() + 8.dp))
                                }
                                items(
                                    items = bloodRequestsWithUsers,
                                    key = { requestWithUser -> requestWithUser.bloodRequest.id }
                                ) { requestWithUser ->
                                    val cardDetails = RequestCardDetails(
                                        name = requestWithUser.user.name ?: "",
                                        emailId = requestWithUser.user.email ?: "",
                                        phoneNo = requestWithUser.user.phoneNumber ?: "",
                                        address = "${requestWithUser.bloodRequest.state}, ${requestWithUser.bloodRequest.district}, ${requestWithUser.bloodRequest.city},${requestWithUser.bloodRequest.pin}",
                                        exactPlace = requestWithUser.bloodRequest.donationCenter,
                                        bloodUnit = requestWithUser.bloodRequest.bloodUnit,
                                        bloodGroup = requestWithUser.bloodRequest.bloodGroup,
                                        noOfAcceptors = requestWithUser.bloodRequest.donors.size,
                                        dueDate = formatDate(requestWithUser.bloodRequest.deadline),
                                        postDate = "${dateDiffInDays(requestWithUser.bloodRequest.createdAt)}",
                                        isOpen = !isDeadlinePassed(requestWithUser.bloodRequest.deadline),
                                        isAcceptor = requestWithUser.bloodRequest.donors.contains(
                                            userId
                                        ),
                                        isMyCreation = requestWithUser.bloodRequest.userId == userId
                                    )
                                    AllRequestCard(details = cardDetails)
                                }
                                item {
                                    Spacer(modifier = Modifier.height(innerPadding.calculateBottomPadding()))
                                }
                            }
                        },
                        onFailure = { exception ->
                            Toast.makeText(
                                context,
                                exception.message ?: "An error occurred",
                                Toast.LENGTH_SHORT
                            ).show()
                        }
                    )
                }
            }
            if (isLoading) {
                LoadingScreen()
            }
        }
    }
}


@Composable
fun TopAppBarComponent(
    searchText: String,
    allRequestViewModel: AllRequestViewModel,
    filterState: String,
    filterDistrict: String,
    filterCity: String,
    filterPin: String
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .background(fadeBlue11),
        contentAlignment = Alignment.Center
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(8.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Box(
                modifier = Modifier
                    .padding(0.dp)
                    .fillMaxWidth(),
                contentAlignment = Alignment.Center
            ) {
                SearchBarComponent(searchQuery = searchText, onSearchQueryChange = {
                    allRequestViewModel.onSearchTextChange(it)
                }, modifier = Modifier.fillMaxWidth())
            }
            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.horizontalScroll(rememberScrollState())
            ) {
                FilterItemComponent(
                    label = "State",
                    options = getStateDataList(),
                    selectedValue = filterState,
                    onSelection = {
                        allRequestViewModel.updateFilterState(it)
                    }, onResetClick = {
                        allRequestViewModel.clearStateFilter()
                    })
                FilterItemComponent(
                    label = "District",
                    options = getDistrictList(filterState),
                    selectedValue = filterDistrict,
                    onSelection = {
                        allRequestViewModel.updateFilterDistrict(it)
                    }, onResetClick = {
                        allRequestViewModel.clearDistrictFilter()
                    })
                FilterItemComponent(
                    label = "City",
                    options = getCityList(filterState, filterDistrict),
                    selectedValue = filterCity,
                    onSelection = {
                        allRequestViewModel.updateFilterCity(it)
                    }, onResetClick = {
                        allRequestViewModel.clearCityFilter()
                    })
                FilterItemComponent(
                    label = "Pin Code",
                    options = getPinCodeList(filterState, filterDistrict, filterCity),
                    selectedValue = filterPin,
                    onSelection = {
                        allRequestViewModel.updateFilterPin(it)
                    }, onResetClick = {
                        allRequestViewModel.clearPinFilter()
                    })
            }
        }
    }
}

@Preview
@Composable
fun AllRequestScreenPreview() {
    AllRequestScreen(
        navController = NavController(LocalContext.current),
        innerPadding = PaddingValues(0.dp),
        token = "",
        userId = ""
    )
}