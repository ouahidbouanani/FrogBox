<template>
  <Layout>
    <Breadcrumb :title="title" :items="items" />
    <b-row>
      <b-col cols="12">
        <div class="card">
          <div class="card-body">
            <b-row>
              <b-col lg="8">
                <div class="table-responsive">
                  <table class="table table-borderless table-nowrap table-centered mb-0">
                    <thead class="table-light">
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                      <th style="width: 50px;"></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                      <td>
                        <img src="@/assets/images/products/product-1.jpg" alt="contact-img"
                             title="contact-img" class="rounded me-3" height="64"/>
                        <p class="m-0 d-inline-block align-middle font-16">
                          <router-link to="/apps/ecommerce/products-details"
                                       class="text-body">Amazing Modern Chair
                          </router-link>
                          <br>
                          <small class="me-2"><b>Size:</b> Large </small>
                          <small><b>Color:</b> Light Green
                          </small>
                        </p>
                      </td>
                      <td>
                        $148.66
                      </td>
                      <td>
                        <input type="number" min="1" value="5" class="form-control"
                               placeholder="Qty" style="width: 90px;">
                      </td>
                      <td>
                        $743.30
                      </td>
                      <td>
                        <a href="javascript:void(0);" class="action-icon"> <i
                            class="mdi mdi-delete"></i></a>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <img src="@/assets/images/products/product-2.jpg" alt="contact-img"
                             title="contact-img" class="rounded me-3" height="64"/>
                        <p class="m-0 d-inline-block align-middle font-16">
                          <router-link to="/apps/ecommerce/products-details"
                                       class="text-body">Biblio Plastic Armchair
                          </router-link>
                          <br>
                          <small class="me-2"><b>Size:</b> Small </small>
                          <small><b>Color:</b> Brown </small>
                        </p>
                      </td>
                      <td>
                        $99.00
                      </td>
                      <td>
                        <input type="number" min="1" value="2" class="form-control"
                               placeholder="Qty" style="width: 90px;">
                      </td>
                      <td>
                        $198.00
                      </td>
                      <td>
                        <a href="javascript:void(0);" class="action-icon"> <i
                            class="mdi mdi-delete"></i></a>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <img src="@/assets/images/products/product-3.jpg" alt="contact-img"
                             title="contact-img" class="rounded me-3" height="64"/>
                        <p class="m-0 d-inline-block align-middle font-16">
                          <router-link to="/apps/ecommerce/products-details" class="text-body">Designer Awesome Chair
                          </router-link>
                          <br>
                          <small class="me-2"><b>Size:</b> Medium </small>
                          <small><b>Color:</b> Green </small>
                        </p>
                      </td>
                      <td>
                        $49.99
                      </td>
                      <td>
                        <input type="number" min="1" value="10" class="form-control"
                               placeholder="Qty" style="width: 90px;">
                      </td>
                      <td>
                        $499.90
                      </td>
                      <td>
                        <a href="javascript:void(0);" class="action-icon"> <i
                            class="mdi mdi-delete"></i></a>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <img src="@/assets/images/products/product-5.jpg" alt="contact-img"
                             title="contact-img" class="rounded me-3" height="64"/>
                        <p class="m-0 d-inline-block align-middle font-16">
                          <router-link to="/apps/ecommerce/products-details" class="text-body">Unpowered aircraft
                          </router-link>
                          <br>
                          <small class="me-2"><b>Size:</b> Large </small>
                          <small><b>Color:</b> Orange </small>
                        </p>
                      </td>
                      <td>
                        $129.99
                      </td>
                      <td>
                        <input type="number" min="1" value="1" class="form-control"
                               placeholder="Qty" style="width: 90px;">
                      </td>
                      <td>
                        $129.99
                      </td>
                      <td>
                        <a href="javascript:void(0);" class="action-icon"> <i
                            class="mdi mdi-delete"></i></a>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>


                <div class="mt-3">
                  <label for="example-textarea" class="form-label">Add a Note:</label>
                  <textarea class="form-control" id="example-textarea" rows="3"
                            placeholder="Write some note.."></textarea>
                </div>


                <b-row class="mt-4">
                  <b-col sm="6">
                    <router-link to="/apps/ecommerce/products"
                                 class="btn text-muted d-none d-sm-inline-block btn-link fw-semibold">
                      <i class="mdi mdi-arrow-left"></i> Continue Shopping
                    </router-link>
                  </b-col> <!-- end col -->
                  <b-col sm="6">
                    <div class="text-sm-end">
                      <router-link to="/apps/ecommerce/checkout" class="btn btn-danger">
                        <i class="mdi mdi-cart-plus me-1"></i> Checkout
                      </router-link>
                    </div>
                  </b-col> <!-- end col -->
                </b-row>
              </b-col>


              <b-col lg="4">
                <div class="border p-3 mt-4 mt-lg-0 rounded">
                  <h4 class="header-title mb-3">Order Summary</h4>

                  <div class="table-responsive">
                    <table class="table mb-0">
                      <tbody>
                      <tr>
                        <td>Grand Total :</td>
                        <td>$1571.19</td>
                      </tr>
                      <tr>
                        <td>Discount :</td>
                        <td>-$157.11</td>
                      </tr>
                      <tr>
                        <td>Shipping Charge :</td>
                        <td>$25</td>
                      </tr>
                      <tr>
                        <td>Estimated Tax :</td>
                        <td>$19.22</td>
                      </tr>
                      <tr>
                        <th>Total :</th>
                        <th>$1458.3</th>
                      </tr>
                      </tbody>
                    </table>
                  </div>

                </div>

                <div class="alert alert-warning mt-3" role="alert">
                  Use coupon code <strong>HYPBM</strong> and get 10% discount !
                </div>

                <div class="input-group mt-3">
                  <input type="text" class="form-control" placeholder="Coupon code" aria-label="Recipient's username">
                  <button class="input-group-text btn-light" type="button">Apply</button>
                </div>

              </b-col>

            </b-row>
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
      title: 'Shopping Cart',
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
          text: 'Shopping Cart',
          active: true,
        },
      ],
    }
  },
}
</script>
