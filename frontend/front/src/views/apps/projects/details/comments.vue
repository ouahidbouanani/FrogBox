<template>
  <div class="card">
    <div class="card-body">
      <h4 class="mt-0 mb-3">Comments (258)</h4>

      <textarea
          id="example-textarea"
          class="form-control form-control-light mb-2"
          placeholder="Write message"
          rows="3"
      ></textarea>
      <div class="text-end">
        <div class="btn-group mb-2">
          <b-button variant="link" size="sm" class="text-muted font-18">
            <i class="ri-attachment-2"></i>
          </b-button>
        </div>
        <div class="btn-group mb-2 ms-2">
          <b-button variant="primary" size="sm">Submit</b-button>
        </div>
      </div>

      <div class="d-flex align-items-start mt-2">

        <img
            class="me-3 avatar-sm rounded-circle"
            src="@/assets/images/users/avatar-3.jpg"
            alt="Generic placeholder image"
        />
        <div class="w-100 overflow-hidden">
          <h5 class="mt-0">Jeremy Tomlinson</h5>Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque
          ante sollicitudin. Cras purus odio, vestibulum in
          vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue
          felis
          in faucibus.

          <div class="d-flex align-items-start mt-3">
            <a class="pe-3" href="#">
              <img
                  src="@/assets/images/users/avatar-4.jpg"
                  class="avatar-sm rounded-circle"
                  alt="Generic placeholder image"
              />
            </a>
            <div class="w-100 overflow-hidden">
              <h5 class="mt-0">Kathleen Thomas</h5>Cras sit amet nibh libero, in gravida nulla. Nulla vel metus
              scelerisque ante sollicitudin. Cras purus odio, vestibulum in
              vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia
              congue
              felis in faucibus.
            </div>
          </div>
        </div>
      </div>

      <div class="text-center mt-2">
        <a href="javascript:void(0);" class="text-danger">Load more</a>
      </div>
    </div>
    <!-- end card-body-->
  </div>
  <!-- end card-->
</template>

<script lang="ts">
export default {}
</script>