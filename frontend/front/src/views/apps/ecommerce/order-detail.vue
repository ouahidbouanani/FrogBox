<template>
  <Layout>
    <Breadcrumb :title="title" :items="items"/>

    <b-row class="justify-content-center">
      <b-col lg="7" md="10" sm="11">
        <div class="horizontal-steps mt-4 mb-4 pb-5" id="tooltip-container">
          <div class="horizontal-steps-content">
            <div class="step-item">
              <span data-bs-container="#tooltip-container" data-bs-toggle="tooltip" data-bs-placement="bottom"
                    title="20/08/2018 07:24 PM">Order Placed</span>
            </div>
            <div class="step-item current">
              <span data-bs-container="#tooltip-container" data-bs-toggle="tooltip" data-bs-placement="bottom"
                    title="21/08/2018 11:32 AM">Packed</span>
            </div>
            <div class="step-item">
              <span>Shipped</span>
            </div>
            <div class="step-item">
              <span>Delivered</span>
            </div>
          </div>

          <div class="process-line" style="width: 33%;"></div>
        </div>
      </b-col>
    </b-row>

    <b-row>
      <b-col lg="8">
        <div class="card">
          <div class="card-body">
            <h4 class="header-title mb-3">Items from Order #12537</h4>

            <div class="table-responsive">
              <table class="table mb-0">
                <thead class="table-light">
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>The Military Duffle Bag</td>
                  <td>3</td>
                  <td>$128</td>
                  <td>$384</td>
                </tr>
                <tr>
                  <td>Mountain Basket Ball</td>
                  <td>1</td>
                  <td>$199</td>
                  <td>$199</td>
                </tr>
                <tr>
                  <td>Wavex Canvas Messenger Bag</td>
                  <td>5</td>
                  <td>$180</td>
                  <td>$900</td>
                </tr>
                <tr>
                  <td>The Utility Shirt</td>
                  <td>2</td>
                  <td>$79</td>
                  <td>$158</td>
                </tr>
                </tbody>
              </table>
            </div>
            <!-- end table-responsive -->

          </div>
        </div>
      </b-col>

      <b-col lg="4">
        <div class="card">
          <div class="card-body">
            <h4 class="header-title mb-3">Order Summary</h4>

            <div class="table-responsive">
              <table class="table mb-0">
                <thead class="table-light">
                <tr>
                  <th>Description</th>
                  <th>Price</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>Grand Total :</td>
                  <td>$1641</td>
                </tr>
                <tr>
                  <td>Shipping Charge :</td>
                  <td>$23</td>
                </tr>
                <tr>
                  <td>Estimated Tax :</td>
                  <td>$19.22</td>
                </tr>
                <tr>
                  <th>Total :</th>
                  <th>$1683.22</th>
                </tr>
                </tbody>
              </table>
            </div>
            <!-- end table-responsive -->

          </div>
        </div>
      </b-col>
    </b-row>


    <b-row>
      <b-col lg="4">
        <div class="card">
          <div class="card-body">
            <h4 class="header-title mb-3">Shipping Information</h4>

            <h5>Stanley Jones</h5>

            <address class="mb-0 font-14 address-lg">
              795 Folsom Ave, Suite 600<br>
              San Francisco, CA 94107<br>
              <abbr title="Phone">P:</abbr> (123) 456-7890 <br/>
              <abbr title="Mobile">M:</abbr> (+01) 12345 67890
            </address>

          </div>
        </div>
      </b-col>

      <b-col lg="4">
        <div class="card">
          <div class="card-body">
            <h4 class="header-title mb-3">Billing Information</h4>

            <ul class="list-unstyled mb-0">
              <li>
                <p class="mb-2"><span class="fw-bold me-2">Payment Type:</span> Credit Card</p>
                <p class="mb-2"><span class="fw-bold me-2">Provider:</span> Visa ending in 2851</p>
                <p class="mb-2"><span class="fw-bold me-2">Valid Date:</span> 02/2020</p>
                <p class="mb-0"><span class="fw-bold me-2">CVV:</span> xxx</p>
              </li>
            </ul>

          </div>
        </div>
      </b-col>

      <b-col lg="4">
        <div class="card">
          <div class="card-body">
            <h4 class="header-title mb-3">Delivery Info</h4>

            <div class="text-center">
              <i class="mdi mdi-truck-fast h2 text-muted"></i>
              <h5><b>UPS Delivery</b></h5>
              <p class="mb-1"><b>Order ID :</b> xxxx235</p>
              <p class="mb-0"><b>Payment Mode :</b> COD</p>
            </div>
          </div>
        </div>
      </b-col>
    </b-row>
  </Layout>
</template>

<script lang="ts">
import Layout from "@/components/layouts/layout.vue";
import Breadcrumb from "@/components/breadcrumb.vue";

export default {
  components: {Breadcrumb, Layout},
  data() {
    return {
      title: 'Order Details',
      items: [
        {
          text: 'Hyper',
          href: '/',
        },
        {
          text: 'eCommerce',
          href: '/',
        },
        {
          text: 'Order Details',
          active: true,
        },
      ],
    }
  },

}
</script>
